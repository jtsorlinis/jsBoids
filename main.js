import bresenham from "bresenham";
import "./style.css";

let screenWidth = Math.floor(window.innerWidth / 3.05);
let screenHeight = Math.floor(window.innerHeight / 3.85);
const canvas = [];
const fps = 60;
const delta = 1 / fps;
let paused = false;
let reeMode = false;
let stillRee = true;
let editMode = false;
let colTimer = 300;

let boidSize = 2;
let numboids = 500;
let boids = [];

let maxSpeed = 100;
let minSpeed = maxSpeed * 0.75;
let turnSpeed = 300;

let edgeMargin = 20;

let visualDistance = 25;
let minDistance = 7.5;

let cohesionFactor = 1;
let alignmentFactor = 5;
let separationFactor = 30;

let targets = genReePixels();

function init() {
  for (let i = 0; i < numboids; i++) {
    boids.push({
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
    });
  }

  for (let i = 0; i < screenHeight; i++) {
    canvas[i] = new Array(screenWidth).fill(0);
  }

  window.addEventListener("mousemove", (e) => {
    if (e.buttons == 1 && targets.length < numboids) {
      let newVal = { x: ~~(e.x / 3.05), y: ~~(e.y / 3.85) };
      let exists = targets.findIndex(
        (pixel) => pixel.x === newVal.x && pixel.y === newVal.y
      );
      if (exists === -1) {
        targets.push(newVal);
        document.title = "Boids " + (numboids - targets.length);
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.code == "KeyP") {
      paused = !paused;
    }

    if (editMode && e.code == "KeyC") {
      targets = [];
      stillRee = false;
      colTimer = 1;
      document.title = "Boids " + (numboids - targets.length);
    }

    if (e.code == "KeyE") {
      editMode = !editMode;
      reeMode = false;
    }

    if (e.code == "Space") {
      reeMode = false;
      boids.forEach((boid) => {
        boid.vx = Math.random() - 0.5;
        boid.vy = Math.random() - 0.5;
      });
    }

    if (e.code == "KeyR") {
      colTimer = 300;
      reeMode = !reeMode;
      maxSpeed = reeMode ? 75 : 100;
      minSpeed = maxSpeed * 0.75;
    }
  });
}

function setPixel(x, y) {
  if (y >= 0 && ~~y < screenHeight && x >= 0 && ~~x < screenWidth) {
    canvas[~~y][~~x] = 1;
  }
}

function rotate2d(x, y, angle) {
  let rx = x * Math.cos(angle) - y * Math.sin(angle);
  let ry = x * Math.sin(angle) + y * Math.cos(angle);
  return [rx, ry];
}

function drawBoid(x, y, vx, vy) {
  let angle = Math.atan2(vy, vx) + Math.PI / 2;
  let [p1x, p1y] = rotate2d(0, -boidSize, angle);
  p1y += y;
  p1x += x;
  let [p2x, p2y] = rotate2d(boidSize, boidSize, angle);
  p2x += x;
  p2y += y;
  let [p3x, p3y] = rotate2d(-boidSize, boidSize, angle);
  p3x += x;
  p3y += y;
  bresenham(p1x, p1y, p2x, p2y, setPixel);
  bresenham(p2x, p2y, p3x, p3y, setPixel);
  bresenham(p3x, p3y, p1x, p1y, setPixel);
}

function drawCanvas() {
  let output = "";
  if (stillRee) {
    colTimer--;
  }
  for (let y = 0; y < screenHeight; y++) {
    if (reeMode && colTimer < 0) {
      output += "<span style='color: hsl(" + y * 2 + ", 100%, 50%)'>";
    } else {
      output += "<span>";
    }
    for (let x = 0; x < screenWidth; x++) {
      output += canvas[y][x] > 0 ? "@" : " ";
      canvas[y][x] = 0;
    }
    output += "</span><br>";
  }
  document.querySelector("#app").innerHTML =
    "<pre><tt>" + output + "</tt></pre>";
}

function update(delta) {
  if (!paused) {
    for (let i = 0; i < numboids; i++) {
      let boid = boids[i];
      boid.x += boid.vx * delta;
      boid.y += boid.vy * delta;

      // Behaviours
      let centerX = 0;
      let centerY = 0;
      let closeX = 0;
      let closeY = 0;
      let avgVelX = 0;
      let avgVelY = 0;
      let neighbours = 0;

      for (let j = 0; j < numboids; j++) {
        let other = boids[j];
        let diffX = other.x - boid.x;
        let diffY = other.y - boid.y;
        let dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist > 0 && dist < visualDistance) {
          if (dist < minDistance) {
            closeX += boid.x - other.x;
            closeY += boid.y - other.y;
          }
          centerX += other.x;
          centerY += other.y;
          avgVelX += other.vx;
          avgVelY += other.vy;
          neighbours++;
        }
      }

      if (neighbours > 0) {
        centerX /= neighbours;
        centerY /= neighbours;
        avgVelX /= neighbours;
        avgVelY /= neighbours;

        boid.vx += (centerX - boid.x) * (cohesionFactor * delta);
        boid.vy += (centerY - boid.y) * (cohesionFactor * delta);
        boid.vx += (avgVelX - boid.vx) * (alignmentFactor * delta);
        boid.vy += (avgVelY - boid.vy) * (alignmentFactor * delta);
      }

      boid.vx += closeX * separationFactor * delta;
      boid.vy += closeY * separationFactor * delta;

      // Ree mode
      if (reeMode) {
        let targetPoint = ~~(i / (numboids / targets.length));
        if (targetPoint < targets.length) {
          boid.vx += targets[targetPoint].x - boid.x;
          boid.vy += targets[targetPoint].y - boid.y;
        }
      }

      // Limit speed
      const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
      if (speed > maxSpeed) {
        boid.vx = (boid.vx / speed) * maxSpeed;
        boid.vy = (boid.vy / speed) * maxSpeed;
      }
      if (speed < minSpeed) {
        boid.vx = (boid.vx / speed) * minSpeed;
        boid.vy = (boid.vy / speed) * minSpeed;
      }

      // Keep in bounds
      if (boid.x > screenWidth - edgeMargin) {
        boid.vx -= turnSpeed * delta;
      } else if (boid.x < edgeMargin) {
        boid.vx += turnSpeed * delta;
      }

      if (boid.y > screenHeight - edgeMargin) {
        boid.vy -= turnSpeed * delta;
      } else if (boid.y < edgeMargin) {
        boid.vy += turnSpeed * delta;
      }

      drawBoid(boid.x, boid.y, boid.vx, boid.vy);
    }

    drawCanvas();
  }
}

init();
while (true) {
  let frameStart = performance.now();
  if (editMode) {
    targets.forEach((pixel) => setPixel(pixel.x, pixel.y));
    drawCanvas();
  } else {
    update(delta);
  }
  let frameTime = performance.now() - frameStart;
  let waitTime = delta * 1000 - frameTime;
  await new Promise((r) => setTimeout(r, waitTime > 0 ? waitTime : 0));
}

function genReePixels() {
  let reePixels = [];

  // R
  reePixels.push({ x: 20, y: 20 });
  reePixels.push({ x: 20, y: 30 });
  reePixels.push({ x: 20, y: 40 });
  reePixels.push({ x: 20, y: 50 });
  reePixels.push({ x: 20, y: 60 });
  reePixels.push({ x: 20, y: 70 });
  reePixels.push({ x: 20, y: 80 });
  reePixels.push({ x: 20, y: 90 });
  reePixels.push({ x: 20, y: 100 });
  reePixels.push({ x: 20, y: 110 });
  reePixels.push({ x: 20, y: 120 });
  reePixels.push({ x: 20, y: 130 });
  reePixels.push({ x: 20, y: 140 });
  reePixels.push({ x: 20, y: 150 });
  reePixels.push({ x: 20, y: 160 });
  reePixels.push({ x: 30, y: 20 });
  reePixels.push({ x: 40, y: 20 });
  reePixels.push({ x: 50, y: 20 });
  reePixels.push({ x: 60, y: 20 });
  reePixels.push({ x: 70, y: 22 });
  reePixels.push({ x: 80, y: 25 });
  reePixels.push({ x: 88, y: 30 });
  reePixels.push({ x: 95, y: 35 });
  reePixels.push({ x: 100, y: 42 });
  reePixels.push({ x: 103, y: 50 });
  reePixels.push({ x: 105, y: 60 });
  reePixels.push({ x: 103, y: 70 });
  reePixels.push({ x: 95, y: 78 });
  reePixels.push({ x: 85, y: 83 });
  reePixels.push({ x: 75, y: 84 });
  reePixels.push({ x: 65, y: 85 });
  reePixels.push({ x: 55, y: 85 });
  reePixels.push({ x: 45, y: 85 });
  reePixels.push({ x: 35, y: 85 });
  reePixels.push({ x: 25, y: 85 });
  reePixels.push({ x: 34, y: 95 });
  reePixels.push({ x: 43, y: 105 });
  reePixels.push({ x: 52, y: 115 });
  reePixels.push({ x: 61, y: 125 });
  reePixels.push({ x: 70, y: 135 });
  reePixels.push({ x: 79, y: 145 });
  reePixels.push({ x: 88, y: 160 });

  // E
  reePixels.push({ x: 150, y: 20 });
  reePixels.push({ x: 150, y: 30 });
  reePixels.push({ x: 150, y: 40 });
  reePixels.push({ x: 150, y: 50 });
  reePixels.push({ x: 150, y: 60 });
  reePixels.push({ x: 150, y: 70 });
  reePixels.push({ x: 150, y: 80 });
  reePixels.push({ x: 150, y: 90 });
  reePixels.push({ x: 150, y: 100 });
  reePixels.push({ x: 150, y: 110 });
  reePixels.push({ x: 150, y: 120 });
  reePixels.push({ x: 150, y: 130 });
  reePixels.push({ x: 150, y: 140 });
  reePixels.push({ x: 150, y: 150 });
  reePixels.push({ x: 150, y: 160 });
  reePixels.push({ x: 160, y: 20 });
  reePixels.push({ x: 170, y: 20 });
  reePixels.push({ x: 180, y: 20 });
  reePixels.push({ x: 190, y: 20 });
  reePixels.push({ x: 200, y: 20 });
  reePixels.push({ x: 210, y: 20 });
  reePixels.push({ x: 220, y: 20 });
  reePixels.push({ x: 230, y: 20 });
  reePixels.push({ x: 160, y: 90 });
  reePixels.push({ x: 170, y: 90 });
  reePixels.push({ x: 180, y: 90 });
  reePixels.push({ x: 190, y: 90 });
  reePixels.push({ x: 200, y: 90 });
  reePixels.push({ x: 210, y: 90 });
  reePixels.push({ x: 220, y: 90 });
  reePixels.push({ x: 230, y: 90 });
  reePixels.push({ x: 160, y: 160 });
  reePixels.push({ x: 170, y: 160 });
  reePixels.push({ x: 180, y: 160 });
  reePixels.push({ x: 190, y: 160 });
  reePixels.push({ x: 200, y: 160 });
  reePixels.push({ x: 210, y: 160 });
  reePixels.push({ x: 220, y: 160 });
  reePixels.push({ x: 230, y: 160 });

  // E
  reePixels.push({ x: 280, y: 20 });
  reePixels.push({ x: 280, y: 30 });
  reePixels.push({ x: 280, y: 40 });
  reePixels.push({ x: 280, y: 50 });
  reePixels.push({ x: 280, y: 60 });
  reePixels.push({ x: 280, y: 70 });
  reePixels.push({ x: 280, y: 80 });
  reePixels.push({ x: 280, y: 90 });
  reePixels.push({ x: 280, y: 100 });
  reePixels.push({ x: 280, y: 110 });
  reePixels.push({ x: 280, y: 120 });
  reePixels.push({ x: 280, y: 130 });
  reePixels.push({ x: 280, y: 140 });
  reePixels.push({ x: 280, y: 150 });
  reePixels.push({ x: 280, y: 160 });
  reePixels.push({ x: 290, y: 20 });
  reePixels.push({ x: 300, y: 20 });
  reePixels.push({ x: 310, y: 20 });
  reePixels.push({ x: 320, y: 20 });
  reePixels.push({ x: 330, y: 20 });
  reePixels.push({ x: 340, y: 20 });
  reePixels.push({ x: 350, y: 20 });
  reePixels.push({ x: 360, y: 20 });
  reePixels.push({ x: 290, y: 90 });
  reePixels.push({ x: 300, y: 90 });
  reePixels.push({ x: 310, y: 90 });
  reePixels.push({ x: 320, y: 90 });
  reePixels.push({ x: 330, y: 90 });
  reePixels.push({ x: 340, y: 90 });
  reePixels.push({ x: 350, y: 90 });
  reePixels.push({ x: 360, y: 90 });
  reePixels.push({ x: 290, y: 160 });
  reePixels.push({ x: 300, y: 160 });
  reePixels.push({ x: 310, y: 160 });
  reePixels.push({ x: 320, y: 160 });
  reePixels.push({ x: 330, y: 160 });
  reePixels.push({ x: 340, y: 160 });
  reePixels.push({ x: 350, y: 160 });
  reePixels.push({ x: 360, y: 160 });
  return reePixels;
}
