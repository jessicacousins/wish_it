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
  };

  flowers.push(flower);
  playWhisper(input);
  document.getElementById("thoughtInput").value = "";
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  flowers.forEach((flower) => {
    flower.radius += flower.growth;
    flower.angle += flower.sway;

    ctx.beginPath();
    ctx.arc(
      flower.x + Math.sin(flower.angle) * 10,
      flower.y - flower.radius,
      flower.radius * 0.5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = flower.color;
    ctx.fill();

    ctx.font = "12px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText(
      flower.word,
      flower.x - flower.radius / 2,
      flower.y - flower.radius - 10
    );
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
