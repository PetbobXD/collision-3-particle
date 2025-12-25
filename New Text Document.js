/* ============================================================
   THREE PARTICLE NON-ELASTIC COLLISION (1D)
   Educational style ala butiran.js (Pak Dudung)
   ============================================================ */

/* ---------- GLOBAL VARIABLES ---------- */
var t, dt;
var x = [], v = [], m = [];
var x0 = [], v0 = [];
var e;
var timer = null;

/* ---------- READ INPUT PARAMETERS ---------- */
function read() {
  dt = parseFloat(document.getElementById("TDELT").value);
  e  = parseFloat(document.getElementById("COEFR").value);

  for (let i = 0; i < 3; i++) {
    m[i] = parseFloat(document.getElementById("M" + (i+1)).value);
    x[i] = parseFloat(document.getElementById("X" + (i+1)).value);
    v[i] = parseFloat(document.getElementById("V" + (i+1)).value);

    x0[i] = x[i];
    v0[i] = v[i];
  }

  t = 0;
  clearLog();
  logState();
}

/* ---------- LOAD DEFAULT EXAMPLE ---------- */
function loadDefault() {
  document.getElementById("TDELT").value = 0.01;
  document.getElementById("COEFR").value = 0.7;

  document.getElementById("M1").value = 1;
  document.getElementById("X1").value = -1;
  document.getElementById("V1").value = 1;

  document.getElementById("M2").value = 1;
  document.getElementById("X2").value = 0;
  document.getElementById("V2").value = 0;

  document.getElementById("M3").value = 1;
  document.getElementById("X3").value = 1;
  document.getElementById("V3").value = 0;

  read();
}

/* ---------- CLEAR SIMULATION ---------- */
function clearSim() {
  if (timer !== null) clearInterval(timer);
  timer = null;

  for (let i = 0; i < 3; i++) {
    x[i] = x0[i];
    v[i] = v0[i];
  }

  t = 0;
  clearLog();
  logState();
}

/* ---------- START SIMULATION ---------- */
function start() {
  if (timer !== null) return;
  timer = setInterval(update, dt * 1000);
}

/* ---------- MAIN UPDATE LOOP ---------- */
function update() {
  let xPrev = x.slice();

  /* Update positions */
  for (let i = 0; i < 3; i++) {
    x[i] += v[i] * dt;
  }

  /* Pairwise collision detection */
  checkCollision(0, 1, xPrev);
  checkCollision(1, 2, xPrev);
  checkCollision(0, 2, xPrev);

  t += dt;
  logState();
}

/* ---------- COLLISION DETECTION ---------- */
function checkCollision(i, j, xPrev) {
  /* Particles collide if they cross each other */
  if ((xPrev[i] - xPrev[j]) * (x[i] - x[j]) <= 0) {
    collide(i, j);
  }
}

/* ---------- NON-ELASTIC COLLISION LAW ---------- */
function collide(i, j) {
  let vi = v[i];
  let vj = v[j];

  v[i] = (m[i]*vi + m[j]*vj - m[j]*e*(vi - vj)) / (m[i] + m[j]);
  v[j] = (m[i]*vi + m[j]*vj + m[i]*e*(vi - vj)) / (m[i] + m[j]);
}

/* ---------- DATA LOGGING ---------- */
function logState() {
  let line = t.toFixed(3);
  for (let i = 0; i < 3; i++) {
    line += "\t" + x[i].toFixed(4) + "\t" + v[i].toFixed(4);
  }
  document.getElementById("output").value += line + "\n";
}

function clearLog() {
  document.getElementById("output").value = "";
}
