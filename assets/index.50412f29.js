(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))p(t);new MutationObserver(t=>{for(const y of t)if(y.type==="childList")for(const r of y.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&p(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const y={};return t.integrity&&(y.integrity=t.integrity),t.referrerpolicy&&(y.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?y.credentials="include":t.crossorigin==="anonymous"?y.credentials="omit":y.credentials="same-origin",y}function p(t){if(t.ep)return;t.ep=!0;const y=s(t);fetch(t.href,y)}})();var q=function(e,u,s,p,t){if(!t){var y=[];t=function(v,N){y.push({x:v,y:N})}}var r=s-e,l=p-u,o=Math.abs(r),x=Math.abs(l),h=0,n=r>0?1:-1,i=l>0?1:-1;if(o>x)for(var a=e,f=u;n<0?a>=s:a<=s;a+=n)t(a,f),h+=x,h<<1>=o&&(f+=i,h-=o);else for(var a=e,f=u;i<0?f>=p:f<=p;f+=i)t(a,f),h+=o,h<<1>=x&&(a+=n,h-=x);return y};let m=Math.floor(window.innerWidth/3.05),M=Math.floor(window.innerHeight/3.85);const S=[],A=60,D=1/A;let X=!1,b=!1,d=2,Y=500,L=[],c=100,P=c*.75,g=300,w=20,I=25,R=7.5,E=1,H=5,K=30;function V(){for(let e=0;e<Y;e++)L.push({x:Math.random()*m,y:Math.random()*M,vx:Math.random()-.5,vy:Math.random()-.5});for(let e=0;e<M;e++)S[e]=new Array(m).fill(0);window.addEventListener("keydown",e=>{e.preventDefault(),e.code=="KeyP"&&(X=!X),e.code=="Space"&&L.forEach(u=>{u.vx=Math.random()-.5,u.vy=Math.random()-.5}),e.code=="KeyR"&&(b=!b,c=b?75:100,P=c*.75)})}function F(e,u){u>=0&&~~u<M&&e>=0&&~~e<m&&(S[~~u][~~e]=1)}function O(e,u,s){let p=e*Math.cos(s)-u*Math.sin(s),t=e*Math.sin(s)+u*Math.cos(s);return[p,t]}function W(e,u,s,p){let t=Math.atan2(p,s)+Math.PI/2,[y,r]=O(0,-d,t);r+=u,y+=e;let[l,o]=O(d,d,t);l+=e,o+=u;let[x,h]=O(-d,d,t);x+=e,h+=u,q(y,r,l,o,F),q(l,o,x,h,F),q(x,h,y,r,F)}function j(){let e="";for(let u=0;u<M;u++){for(let s=0;s<m;s++)e+=S[u][s]>0?"@":" ",S[u][s]=0;e+="<br>"}document.querySelector("#app").innerHTML="<pre><tt>"+e+"</tt></pre>"}function k(e){if(!X){for(let u=0;u<Y;u++){let s=L[u];s.x+=s.vx*e,s.y+=s.vy*e;let p=0,t=0,y=0,r=0,l=0,o=0,x=0;for(let n=0;n<Y;n++){let i=L[n],a=i.x-s.x,f=i.y-s.y,v=Math.sqrt(a*a+f*f);v>0&&v<I&&(v<R&&(y+=s.x-i.x,r+=s.y-i.y),p+=i.x,t+=i.y,l+=i.vx,o+=i.vy,x++)}if(x>0&&(p/=x,t/=x,l/=x,o/=x,s.vx+=(p-s.x)*(E*e),s.vy+=(t-s.y)*(E*e),s.vx+=(l-s.vx)*(H*e),s.vy+=(o-s.vy)*(H*e)),s.vx+=y*K*e,s.vy+=r*K*e,b){let n=~~(u/4.2);n<T.length&&(s.vx+=T[n].x-s.x,s.vy+=T[n].y-s.y)}const h=Math.sqrt(s.vx*s.vx+s.vy*s.vy);h>c&&(s.vx=s.vx/h*c,s.vy=s.vy/h*c),h<P&&(s.vx=s.vx/h*P,s.vy=s.vy/h*P),s.x>m-w?s.vx-=g*e:s.x<w&&(s.vx+=g*e),s.y>M-w?s.vy-=g*e:s.y<w&&(s.vy+=g*e),W(s.x,s.y,s.vx,s.vy)}j()}}const T=z();V();for(;;){let e=performance.now();k(D);let u=performance.now()-e,s=D*1e3-u;await new Promise(p=>setTimeout(p,s>0?s:0))}function z(){let e=[];return e.push({x:20,y:20}),e.push({x:20,y:30}),e.push({x:20,y:40}),e.push({x:20,y:50}),e.push({x:20,y:60}),e.push({x:20,y:70}),e.push({x:20,y:80}),e.push({x:20,y:90}),e.push({x:20,y:100}),e.push({x:20,y:110}),e.push({x:20,y:120}),e.push({x:20,y:130}),e.push({x:20,y:140}),e.push({x:20,y:150}),e.push({x:20,y:160}),e.push({x:30,y:20}),e.push({x:40,y:20}),e.push({x:50,y:20}),e.push({x:60,y:20}),e.push({x:70,y:22}),e.push({x:80,y:25}),e.push({x:88,y:30}),e.push({x:95,y:35}),e.push({x:100,y:42}),e.push({x:103,y:50}),e.push({x:105,y:60}),e.push({x:103,y:70}),e.push({x:95,y:78}),e.push({x:85,y:83}),e.push({x:75,y:84}),e.push({x:65,y:85}),e.push({x:55,y:85}),e.push({x:45,y:85}),e.push({x:35,y:85}),e.push({x:25,y:85}),e.push({x:34,y:95}),e.push({x:43,y:105}),e.push({x:52,y:115}),e.push({x:61,y:125}),e.push({x:70,y:135}),e.push({x:79,y:145}),e.push({x:88,y:160}),e.push({x:150,y:20}),e.push({x:150,y:30}),e.push({x:150,y:40}),e.push({x:150,y:50}),e.push({x:150,y:60}),e.push({x:150,y:70}),e.push({x:150,y:80}),e.push({x:150,y:90}),e.push({x:150,y:100}),e.push({x:150,y:110}),e.push({x:150,y:120}),e.push({x:150,y:130}),e.push({x:150,y:140}),e.push({x:150,y:150}),e.push({x:150,y:160}),e.push({x:160,y:20}),e.push({x:170,y:20}),e.push({x:180,y:20}),e.push({x:190,y:20}),e.push({x:200,y:20}),e.push({x:210,y:20}),e.push({x:220,y:20}),e.push({x:230,y:20}),e.push({x:160,y:90}),e.push({x:170,y:90}),e.push({x:180,y:90}),e.push({x:190,y:90}),e.push({x:200,y:90}),e.push({x:210,y:90}),e.push({x:220,y:90}),e.push({x:230,y:90}),e.push({x:160,y:160}),e.push({x:170,y:160}),e.push({x:180,y:160}),e.push({x:190,y:160}),e.push({x:200,y:160}),e.push({x:210,y:160}),e.push({x:220,y:160}),e.push({x:230,y:160}),e.push({x:280,y:20}),e.push({x:280,y:30}),e.push({x:280,y:40}),e.push({x:280,y:50}),e.push({x:280,y:60}),e.push({x:280,y:70}),e.push({x:280,y:80}),e.push({x:280,y:90}),e.push({x:280,y:100}),e.push({x:280,y:110}),e.push({x:280,y:120}),e.push({x:280,y:130}),e.push({x:280,y:140}),e.push({x:280,y:150}),e.push({x:280,y:160}),e.push({x:290,y:20}),e.push({x:300,y:20}),e.push({x:310,y:20}),e.push({x:320,y:20}),e.push({x:330,y:20}),e.push({x:340,y:20}),e.push({x:350,y:20}),e.push({x:360,y:20}),e.push({x:290,y:90}),e.push({x:300,y:90}),e.push({x:310,y:90}),e.push({x:320,y:90}),e.push({x:330,y:90}),e.push({x:340,y:90}),e.push({x:350,y:90}),e.push({x:360,y:90}),e.push({x:290,y:160}),e.push({x:300,y:160}),e.push({x:310,y:160}),e.push({x:320,y:160}),e.push({x:330,y:160}),e.push({x:340,y:160}),e.push({x:350,y:160}),e.push({x:360,y:160}),e}
