// =======================
// GLOBAL VARIABLES
// =======================
let particles = [];
let DT = 0.01;
let STEPS = 1000;
let COEFR = 0.8;

let running = false;
let stepCount = 0;
let timer = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// =======================
// PARTICLE CLASS
// =======================
class Particle {
  constructor(x, y, vx, vy, m, r) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.m = m;
    this.r = r;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(
      this.x * canvas.width,
      canvas.height / 2 - this.y * canvas.width,
      this.r * canvas.width,
      0, 2 * Math.PI
    );
    ctx.stroke();
  }
}

// =======================
// PARSER (BUTIRAN STYLE)
// =======================
function readParams() {
  particles = [];
  const lines = document.getElementById("input").value.split("\n");

  lines.forEach(line => {
    line = line.trim();
    if (line === "" || line.startsWith("#")) return;

    const p = line.split(/\s+/);

    if (p[0] === "DT") DT = parseFloat(p[1]);
    if (p[0] === "STEPS") STEPS = parseInt(p[1]);
    if (p[0] === "COEFR") COEFR = parseFloat(p[1]);

    if (p[0] === "P") {
      particles.push(new Particle(
        parseFloat(p[1]),
        parseFloat(p[2]),
        parseFloat(p[3]),
        parseFloat(p[4]),
        parseFloat(p[5]),
        parseFloat(p[6])
      ));
    }
  });

  draw();
}

// =======================
// COLLISION HANDLER
// =======================
function resolveCollision(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);
  const minDist = p1.r + p2.r;

  if (dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;

  const dvx = p2.vx - p1.vx;
  const dvy = p2.vy - p1.vy;
  const vn = dvx * nx + dvy * ny;

  if (vn > 0) return;

  const e = COEFR;
  const j = -(1 + e) * vn / (1 / p1.m + 1 / p2.m);

  const ix = j * nx;
  const iy = j * ny;

  p1.vx -= ix / p1.m;
  p1.vy -= iy / p1.m;
  p2.vx += ix / p2.m;
  p2.vy += iy / p2.m;
}

// =======================
// SIMULATION LOOP
// =======================
function step() {
  if (!running || stepCount > STEPS) return;

  particles.forEach(p => p.update(DT));

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      resolveCollision(particles[i], particles[j]);
    }
  }

  draw();
  stepCount++;
}

// =======================
// DRAW
// =======================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.draw());
}

// =======================
// BUTTON HANDLERS
// =======================
function startSim() {
  if (running) return;
  running = true;
  timer = setInterval(step, 20);
}

function stopSim() {
  running = false;
  clearInterval(timer);
}

function clearSim() {
  stopSim();
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function loadDefault() {
  document.getElementById("input").value =
`# Simulation Parameters
DT 0.01
STEPS 2000
COEFR 0.7

# Particles: x y vx vy mass radius
P 0.2 0.0  1.0 0.0  1.0 0.03
P 0.5 0.0  0.0 0.0  1.0 0.03
P 0.8 0.0  0.0 0.0  1.0 0.03`;
}
