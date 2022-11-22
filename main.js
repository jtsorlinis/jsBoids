import bresenham from "bresenham";
import "./style.css";

let screenWidth = Math.floor(window.innerWidth / 3.05);
let screenHeight = Math.floor(window.innerHeight / 3.85);
const canvas = [];
const fps = 60;
const delta = 1 / fps;
let paused = false;

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

  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.code == "KeyP") {
      paused = !paused;
    }
    if (e.code == "Space") {
      boids.forEach((boid) => {
        boid.vx = Math.random() - 0.5;
        boid.vy = Math.random() - 0.5;
      });
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
  for (let y = 0; y < screenHeight; y++) {
    for (let x = 0; x < screenWidth; x++) {
      output += canvas[y][x] > 0 ? "@" : " ";
      canvas[y][x] = 0;
    }
    output += "<br>";
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
  update(delta);
  let frameTime = performance.now() - frameStart;
  let waitTime = delta * 1000 - frameTime;
  await new Promise((r) => setTimeout(r, waitTime > 0 ? waitTime : 0));
}
