const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let flowers = [];
let fireflies = [];
let butterflies = [];

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

function plantThought() {
  const input = document.getElementById("thoughtInput").value;
  if (!input) return;

  const flower = {
    x: Math.random() * canvas.width,
    y: canvas.height - 100,
    radius: 0,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    word: input,
    angle: Math.random() * Math.PI * 2,
    growth: Math.random() * 1 + 0.5,
    sway: Math.random() * 0.05 + 0.01,
    floatSpeed: Math.random() * 0.5 + 0.2,
  };

  flowers.push(flower);
  playWhisper(input);
  document.getElementById("thoughtInput").value = "";
}

function drawFlowerShape(flower) {
  const petalCount = 10;
  const petalRadius = flower.radius;
  const centerX = flower.x + Math.sin(flower.angle) * 10;
  const centerY = flower.y - flower.radius;

  // stem
  ctx.beginPath();
  ctx.strokeStyle = "#3b6e3b";
  ctx.lineWidth = 7;
  ctx.moveTo(flower.x, canvas.height);
  ctx.lineTo(centerX, centerY);
  ctx.stroke();

  // swaying leaves
  const leafCount = 3;
  const time = Date.now() * 0.002;
  for (let i = 1; i <= leafCount; i++) {
    const stemHeight =
      canvas.height - (canvas.height - centerY) * (i / (leafCount + 1));
    const leafX = flower.x;
    const leafY = stemHeight;
    const leafLength = 30;
    const leafWidth = 20;

    const sway = Math.sin(time + flower.x * 0.05 + i) * 5;

    ctx.beginPath();
    const direction = i % 2 === 0 ? 1 : -1;
    ctx.moveTo(leafX, leafY);
    ctx.quadraticCurveTo(
      leafX + direction * (leafLength + sway),
      leafY - leafWidth,
      leafX + direction * (leafLength + sway),
      leafY
    );
    ctx.quadraticCurveTo(
      leafX + direction * (leafLength + sway),
      leafY + leafWidth,
      leafX,
      leafY
    );
    ctx.fillStyle = "#4caf50";
    ctx.fill();
  }

  //  flower rainbow
  const isRainbow = /rainbow|dream|magic|hope|joy|color/i.test(flower.word);

  // petals
  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount + flower.angle;
    const x1 = centerX + Math.cos(angle) * petalRadius;
    const y1 = centerY + Math.sin(angle) * petalRadius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.quadraticCurveTo(
      (centerX + x1) / 2 + Math.sin(angle) * petalRadius * 0.3,
      (centerY + y1) / 2 - Math.cos(angle) * petalRadius * 0.3,
      x1,
      y1
    );

    ctx.fillStyle = isRainbow
      ? `hsl(${(i / petalCount) * 360}, 80%, 65%)`
      : flower.color;

    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, petalRadius * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = isRainbow ? "#fff" : "gold";
  ctx.fill();

  // user words
  ctx.font = "12px Courier New";
  ctx.fillStyle = "white";
  ctx.fillText(
    flower.word,
    centerX - flower.radius / 2,
    centerY + petalRadius + 12
  );
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

  drawFireflies();
  drawButterflies();

  flowers.forEach((flower) => {
    flower.radius += flower.growth;
    flower.angle += flower.sway;
    flower.y -= flower.floatSpeed;
    if (flower.radius > 50) flower.radius = 50;

    drawFlowerShape(flower);
  });

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
