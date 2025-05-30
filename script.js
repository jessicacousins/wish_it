const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mode = "night";

let flowers = [];
let fireflies = [];
let butterflies = [];
let particles = [];

let stars = [];

for (let i = 0; i < 80; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * (canvas.height * 0.6),
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.2,
  });
}

// fireflies
for (let i = 0; i < 20; i++) {
  fireflies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 1.5,
    vx: Math.random() * 1 - 0.5,
    vy: Math.random() * 0.4 - 0.2,
    glowPhase: Math.random(),
  });
}

// butterflies
for (let i = 0; i < 5; i++) {
  butterflies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.random() * 3 - 1.5,
    vy: Math.random() * 3 - 1.5,
    flap: Math.random() * Math.PI * 2,
  });
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const alpha = p.life / 60;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
    ctx.fill();
  }
}

function plantThought() {
  const input = document.getElementById("thoughtInput").value;
  if (!input) return;

  const maxHeight = canvas.height * 0.7;
  const minHeight = canvas.height * 0.3;

  const flower = {
    x: Math.random() * canvas.width,
    targetY: Math.random() * (maxHeight - minHeight) + minHeight,
    y: canvas.height,
    radius: 0,
    // color: `hsl(${Math.floor(Math.random() * 80 + 20)}, 80%, 70%)`,
    color: pickHappyColor(),
    word: input,
    angle: Math.random() * Math.PI * 2,
    growth: Math.random() * 1 + 0.5,
    sway: Math.random() * 0.05 + 0.01,
    floatSpeed: Math.random() * 0.5 + 0.2,
    style: Math.random() < 0.5 ? "cute" : "classic",
  };

  for (let i = 0; i < 20; i++) {
    particles.push({
      x: flower.x,
      y: flower.targetY,
      radius: Math.random() * 2 + 1,
      vx: Math.cos(i) * (Math.random() * 2),
      vy: Math.sin(i) * (Math.random() * 2),
      color: mode === "day" ? "255,215,0" : "255,192,203",
      life: 60,
    });
  }

  flowers.push(flower);

  const numberEl = document.getElementById("flowerNumber");
  numberEl.textContent = flowers.length;
  numberEl.classList.add("animate");
  setTimeout(() => numberEl.classList.remove("animate"), 300);

  playWhisper(input);
  document.getElementById("thoughtInput").value = "";
}

function drawFlowerShape(flower) {
  const petalRadius = flower.radius;
  const centerX = flower.x + Math.sin(flower.angle) * 10;
  const centerY = flower.targetY - flower.radius;

  ctx.beginPath();
  ctx.strokeStyle = "#3b6e3b";
  ctx.lineWidth = 7;
  ctx.moveTo(flower.x, canvas.height);
  ctx.lineTo(centerX, flower.targetY);
  ctx.stroke();

  const leafCount = 2;
  const time = Date.now() * 0.002;
  for (let i = 1; i <= leafCount; i++) {
    const stemHeight =
      canvas.height - (canvas.height - centerY) * (i / (leafCount + 1));
    const sway = Math.sin(time + flower.x * 0.05 + i) * 5;
    const direction = i % 2 === 0 ? 1 : -1;

    ctx.beginPath();
    ctx.moveTo(flower.x, stemHeight);
    ctx.quadraticCurveTo(
      flower.x + direction * (30 + sway),
      stemHeight - 20,
      flower.x + direction * (30 + sway),
      stemHeight
    );
    ctx.quadraticCurveTo(
      flower.x + direction * (30 + sway),
      stemHeight + 20,
      flower.x,
      stemHeight
    );
    ctx.fillStyle = "#4caf50";
    ctx.fill();
  }

  const isRainbow = /rainbow|dream|magic|hope|joy|color/i.test(flower.word);
  const isCute = flower.style === "cute";
  const petalCount = isCute ? 6 : 10;

  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount + flower.angle;
    const x1 = centerX + Math.cos(angle) * petalRadius;
    const y1 = centerY + Math.sin(angle) * petalRadius;

    ctx.beginPath();
    if (isCute) {
      ctx.ellipse(
        x1,
        y1,
        petalRadius * 0.4,
        petalRadius * 0.25,
        angle,
        0,
        Math.PI * 2
      );
    } else {
      ctx.moveTo(centerX, centerY);
      ctx.quadraticCurveTo(
        (centerX + x1) / 2 + Math.sin(angle) * petalRadius * 0.5,
        (centerY + y1) / 2 - Math.cos(angle) * petalRadius * 0.5,
        x1,
        y1
      );
    }

    ctx.fillStyle = isRainbow
      ? `hsl(${(i / petalCount) * 360}, 80%, 65%)`
      : flower.color;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, petalRadius * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff5c1";
  ctx.fill();

  ctx.font = "12px Courier New";
  ctx.fillStyle = "white";
  ctx.fillText(
    flower.word,
    centerX - flower.radius / 2,
    centerY + petalRadius + 12
  );
}

// ! sky with depth
function drawSkyBackground() {
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (mode === "day") {
    gradient.addColorStop(0, "#fcfaee");
    gradient.addColorStop(0.2, "#87ceeb");
    gradient.addColorStop(1, "#87ceeb");
  } else {
    gradient.addColorStop(0, "#0e0e1a");
    gradient.addColorStop(0.5, "#1a1a2e");
    gradient.addColorStop(1, "#000");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === "night") {
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  }

  if (mode === "day") {
    for (let i = 0; i < 3; i++) {
      const cx = (i * canvas.width) / 3 + 100;
      const cy = 100 + Math.sin(Date.now() * 0.001 + i) * 10;

      // ctx.beginPath();
      // ctx.ellipse(cx, cy, 60, 20, 0, 0, Math.PI * 2);
      // ctx.ellipse(cx + 30, cy + 10, 50, 20, 0, 0, Math.PI * 2);
      // ctx.ellipse(cx - 30, cy + 10, 50, 20, 0, 0, Math.PI * 2);
      // ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      // ctx.fill();
    }
  }
}

function drawFireflies() {
  const time = Date.now() * 0.002;
  fireflies.forEach((f) => {
    f.x += f.vx;
    f.y += f.vy;
    f.glowPhase += 0.02;

    if (f.x < 0 || f.x > canvas.width) f.vx *= -1;
    if (f.y < 0 || f.y > canvas.height) f.vy *= -1;

    const glow = Math.sin(f.glowPhase) * 0.5 + 0.5;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 150, ${glow})`;
    ctx.fill();
  });
}

function drawButterflies() {
  butterflies.forEach((b) => {
    b.x += b.vx;
    b.y += b.vy;
    b.flap += 0.2;

    if (b.x < 0 || b.x > canvas.width) b.vx *= -1;
    if (b.y < 0 || b.y > canvas.height) b.vy *= -1;

    const flapAngle = Math.sin(b.flap) * 0.5;
    const wingColor = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, 14);
    wingColor.addColorStop(0, "#ff8ff1");
    wingColor.addColorStop(1, "#e03cd6");

    //  upper left wing
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(flapAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-20, -10, -30, -30, -10, -40);
    ctx.bezierCurveTo(-5, -30, -5, -10, 0, 0);
    ctx.fillStyle = wingColor;
    ctx.fill();
    ctx.restore();

    // upper right wing
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(-flapAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(20, -10, 30, -30, 10, -40);
    ctx.bezierCurveTo(5, -30, 5, -10, 0, 0);
    ctx.fillStyle = wingColor;
    ctx.fill();
    ctx.restore();

    // lower left wing
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(flapAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(20, 10, 25, 25, 10, 30);
    ctx.bezierCurveTo(-5, 20, -5, 10, 0, 0);
    ctx.fillStyle = "#ff69b4";
    ctx.fill();
    ctx.restore();

    // lower right wing
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(-flapAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-20, 10, -25, 25, -10, 30);
    ctx.bezierCurveTo(5, 20, 5, 10, 0, 0);
    ctx.fillStyle = "#ff69b4";
    ctx.fill();
    ctx.restore();

    // body
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 10);
    ctx.lineTo(b.x, b.y + 10);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // antennae
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 10);
    ctx.quadraticCurveTo(b.x - 3, b.y - 20, b.x - 6, b.y - 12);
    ctx.moveTo(b.x, b.y - 10);
    ctx.quadraticCurveTo(b.x + 3, b.y - 20, b.x + 6, b.y - 12);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSkyBackground();
  drawFireflies();
  drawButterflies();

  flowers.forEach((flower) => {
    flower.radius += flower.growth;
    flower.angle += flower.sway;

    if (flower.y > flower.targetY) {
      flower.y -= flower.floatSpeed;
      if (flower.y < flower.targetY) {
        flower.y = flower.targetY;
      }
    }

    if (flower.radius > 50) flower.radius = 50;

    drawFlowerShape(flower);
  });
  drawParticles();

  requestAnimationFrame(animate);
}

function playWhisper(word) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    150 + Math.random() * 50,
    audioCtx.currentTime
  );
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 2.5
  );

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 2.5);
}

animate();

function toggleMode() {
  mode = mode === "day" ? "night" : "day";
}

// flower color array
function pickHappyColor() {
  const happyColors = [
    "#FF69B4", // hot pink
    "#FFB6C1", // light pink
    "#FFD700", // gold
    "#FFA500", // orange
    "#FF6347", // tomato red
    "#FF4500", // coral
    "#EE82EE", // violet
    "#DA70D6", // orchid
    "#87CEFA", // sky blue
    "#00BFFF", // deep sky blue
    "#00CED1", // dark turquoise
    "#7FFFD4", // aquamarine
    "#ADFF2F", // green-yellow
    "#FFFF99", // soft yellow
  ];
  return happyColors[Math.floor(Math.random() * happyColors.length)];
}
