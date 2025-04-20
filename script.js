const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let flowers = [];

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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
