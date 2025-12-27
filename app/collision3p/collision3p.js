// =====================================================
// collision3p.js
// 3 Particle Non-Elastic Collision (2D)
// Time stepping with explicit TDELT (Euler)
// =====================================================

// ---------- GLOBAL ----------
// ================= GLOBAL =================
let canvas, ctx;
let particles = [];

let TDELT = 0.01;
let STEPS = 2000;
let DT = 0.01;
let COEFR = 0.7;

let stepCount = 0;
let t = 0;

let running = false;
let timer = null;
let time = 0;

// visual mapping
const SCALE = 350;
const ORIGIN = { x: 300, y: 200 };
const SCALE = 200;
const ORIGIN = { x: 300, y: 250 };

// ---------- PARTICLE ----------
// ================= PARTICLE =================
class Particle {
constructor(x, y, vx, vy, m, r) {
this.x = x;
@@ -51,68 +39,61 @@ class Particle {
}
}

// ---------- INIT ----------
window.onload = function () {
// ================= INIT =================
window.onload = () => {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
loadDefault();
};

// ---------- PARSER ----------
// ================= DEFAULT =================
function loadDefault() {
  document.getElementById("params").value =
`DT 0.01
COEFR 0.7
# x y vx vy m r
P -0.6 0 1 0 1 0.05
P 0.0 0 0 0 1 0.05
P 0.6 0 0 0 1 0.05`;
  readParams();
}

// ================= READ PARAMS =================
function readParams() {
particles = [];
  stepCount = 0;
  t = 0;

  const lines = document.getElementById("input").value.split("\n");
  time = 0;
  clearTable();

  const lines = document.getElementById("params").value.split("\n");
lines.forEach(line => {
line = line.trim();
    if (line === "" || line.startsWith("#")) return;

    if (!line || line.startsWith("#")) return;
const p = line.split(/\s+/);

    if (p[0] === "TDELT") TDELT = parseFloat(p[1]);
    if (p[0] === "STEPS") STEPS = parseInt(p[1]);
    if (p[0] === "DT") DT = parseFloat(p[1]);
if (p[0] === "COEFR") COEFR = parseFloat(p[1]);

if (p[0] === "P") {
      particles.push(
        new Particle(
          parseFloat(p[1]),
          parseFloat(p[2]),
          parseFloat(p[3]),
          parseFloat(p[4]),
          parseFloat(p[5]),
          parseFloat(p[6])
        )
      );
      particles.push(new Particle(
        +p[1], +p[2], +p[3], +p[4], +p[5], +p[6]
      ));
}
});

  document.getElementById("log").value =
    "# t  x0 y0 vx0 vy0  x1 y1 vx1 vy1  x2 y2 vx2 vy2\n";

  logData(); // log kondisi awal t = 0
draw();
}

// ---------- COLLISION ----------
// ================= COLLISION =================
function resolveCollision(a, b) {
const dx = b.x - a.x;
const dy = b.y - a.y;
const dist = Math.hypot(dx, dy);
  const minDist = a.r + b.r;

  if (dist >= minDist) return;
  if (dist === 0 || dist > a.r + b.r) return;

const nx = dx / dist;
const ny = dy / dist;

const dvx = b.vx - a.vx;
const dvy = b.vy - a.vy;
const vn = dvx * nx + dvy * ny;

if (vn > 0) return;

const j = -(1 + COEFR) * vn / (1 / a.m + 1 / b.m);
@@ -123,32 +104,28 @@ function resolveCollision(a, b) {
b.vy += (j * ny) / b.m;
}

// ---------- TIME STEP ----------
// ================= STEP =================
function step() {
  if (!running || stepCount >= STEPS) return;
  if (!running) return;

  // update posisi (Euler)
  particles.forEach(p => p.update(TDELT));
  particles.forEach(p => p.update(DT));

  // cek tumbukan
for (let i = 0; i < particles.length; i++) {
for (let j = i + 1; j < particles.length; j++) {
resolveCollision(particles[i], particles[j]);
}
}

  t += TDELT;
  stepCount++;

logData();
draw();
  time += DT;
}

// ---------- DRAW ----------
// ================= DRAW =================
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

  // axes
  // axis
ctx.strokeStyle = "#aaa";
ctx.beginPath();
ctx.moveTo(0, ORIGIN.y);
@@ -160,22 +137,26 @@ function draw() {
particles.forEach(p => p.draw());
}

// ---------- LOGGER (UAS STYLE) ----------
// ================= DATA TABLE =================
function logData() {
  let line = t.toFixed(4);

  const tbody = document.getElementById("databody");
particles.forEach(p => {
    line += " " +
      p.x.toFixed(4) + " " +
      p.y.toFixed(4) + " " +
      p.vx.toFixed(4) + " " +
      p.vy.toFixed(4);
    const row = document.createElement("tr");
    row.innerHTML =
      `<td>${time.toFixed(2)}</td>
       <td>${p.x.toFixed(3)}</td>
       <td>${p.y.toFixed(3)}</td>
       <td>${p.vx.toFixed(3)}</td>
       <td>${p.vy.toFixed(3)}</td>`;
    tbody.appendChild(row);
});
}

  document.getElementById("log").value += line + "\n";
function clearTable() {
  document.getElementById("databody").innerHTML = "";
}

// ---------- BUTTONS ----------
// ================= BUTTONS =================
function startSim() {
if (running) return;
running = true;
@@ -190,25 +171,6 @@ function stopSim() {
function clearSim() {
stopSim();
particles = [];
  clearTable();
draw();
}

function loadDefault() {
  document.getElementById("input").value =
`# =========================
# Simulation Parameters
# =========================
TDELT 0.01
STEPS 2000
COEFR 0.7

# =========================
# Particles
# x  y  vx  vy  mass  radius
# =========================
P -0.6   0.0   1.0  0.0   1.0   0.04
P  0.0   0.0   0.0  0.0   1.0   0.04
P  0.6  -0.0   0.0  0.0   1.0   0.04`;

  readParams();
}
