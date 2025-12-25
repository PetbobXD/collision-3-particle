/* ============================================
   3 PARTICLE NON-ELASTIC COLLISION (1D)
   Visual + Numerical (butiran.js style)
   ============================================ */

var canvas, ctx;
var W = 600, H = 120;

var t, dt, e;
var x = [], v = [], m = [];
var x0 = [], v0 = [];
var timer = null;

var scale = 200;     // meter → pixel
var offset = W/2;   // origin in canvas
var radius = 10;

/* ---------- INIT ---------- */
window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  loadDefault();
};

/* ---------- READ ---------- */
function read() {
  dt = parseFloat(TDELT.value);
  e  = parseFloat(COEFR.value);

  for (let i=0;i<3;i++) {
    m[i] = parseFloat(document.getElementById("M"+(i+1)).value);
    x[i] = parseFloat(document.getElementById("X"+(i+1)).value);
    v[i] = parseFloat(document.getElementById("V"+(i+1)).value);
    x0[i]=x[i]; v0[i]=v[i];
  }

  t = 0;
  clearLog();
  draw();
  log();
}

/* ---------- DEFAULT ---------- */
function loadDefault() {
  TDELT.value = 0.01;
  COEFR.value = 0.7;

  M1.value=1; X1.value=-1; V1.value=1;
  M2.value=1; X2.value=0;  V2.value=0;
  M3.value=1; X3.value=1;  V3.value=0;

  read();
}

/* ---------- CLEAR ---------- */
function clearSim() {
  if(timer) clearInterval(timer);
  timer=null;

  for(let i=0;i<3;i++){
    x[i]=x0[i];
    v[i]=v0[i];
  }
  t=0;
  clearLog();
  draw();
  log();
}

/* ---------- START ---------- */
function start() {
  if(timer) return;
  timer=setInterval(step, dt*1000);
}

/* ---------- STEP ---------- */
function step() {
  let xp = x.slice();

  for(let i=0;i<3;i++){
    x[i]+=v[i]*dt;
  }

  check(0,1,xp);
  check(1,2,xp);
  check(0,2,xp);

  t+=dt;
  draw();
  log();
}

/* ---------- COLLISION ---------- */
function check(i,j,xp){
  if((xp[i]-xp[j])*(x[i]-x[j])<=0){
    collide(i,j);
  }
}

function collide(i,j){
  let vi=v[i], vj=v[j];
  v[i]=(m[i]*vi+m[j]*vj-m[j]*e*(vi-vj))/(m[i]+m[j]);
  v[j]=(m[i]*vi+m[j]*vj+m[i]*e*(vi-vj))/(m[i]+m[j]);
}

/* ---------- DRAW ---------- */
function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.beginPath();
  ctx.moveTo(0,H/2);
  ctx.lineTo(W,H/2);
  ctx.stroke();

  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.arc(offset+x[i]*scale, H/2, radius, 0, 2*Math.PI);
    ctx.fillStyle=["red","blue","green"][i];
    ctx.fill();
  }
}

/* ---------- LOG ---------- */
function log(){
  let s=t.toFixed(3);
  for(let i=0;i<3;i++){
    s+="\t"+x[i].toFixed(3)+"\t"+v[i].toFixed(3);
  }
  output.value+=s+"\n";
}

function clearLog(){
  output.value="";
}
