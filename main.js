// Mario-style jump sound using Web Audio API
const jumpAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playJumpSound() {
  const o = jumpAudioCtx.createOscillator();
  const g = jumpAudioCtx.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(880, jumpAudioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(440, jumpAudioCtx.currentTime + 0.18);
  g.gain.setValueAtTime(0.18, jumpAudioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0, jumpAudioCtx.currentTime + 0.18);
  o.connect(g);
  g.connect(jumpAudioCtx.destination);
  o.start();
  o.stop(jumpAudioCtx.currentTime + 0.18);
}
// Flappy Bird Clone
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_GAP = 140;
const PIPE_WIDTH = 60;
const PIPE_SPEED = 2.5;
const BIRD_X = 80;
const BIRD_RADIUS = 18;
const FLOOR_HEIGHT = 80;

// Game state
let birdY = canvas.height / 2;
let birdV = 0;
let pipes = [];
let score = 0;
let highScore = 0;
let gameOver = false;
let started = false;

// Assets (drawn in code for simplicity)
function drawBird(y) {
  ctx.save();
  ctx.translate(BIRD_X, y);
  ctx.rotate(Math.min(Math.PI/6, birdV/10));
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe066';
  ctx.fill();
  ctx.strokeStyle = '#d4a200';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Eye
  ctx.beginPath();
  ctx.arc(7, -6, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9, -6, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#222';
  ctx.fill();
  // Beak
  ctx.beginPath();
  ctx.moveTo(BIRD_RADIUS, 0);
  ctx.lineTo(BIRD_RADIUS + 10, -5);
  ctx.lineTo(BIRD_RADIUS + 10, 5);
  ctx.closePath();
  ctx.fillStyle = '#ffad1f';
  ctx.fill();
  ctx.restore();
}

function drawPipe(x, top, bottom) {
  ctx.fillStyle = '#5ec639';
  ctx.fillRect(x, 0, PIPE_WIDTH, top);
  ctx.fillRect(x, bottom, PIPE_WIDTH, canvas.height - bottom - FLOOR_HEIGHT);
  // Pipe border
  ctx.strokeStyle = '#38761d';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, 0, PIPE_WIDTH, top);
  ctx.strokeRect(x, bottom, PIPE_WIDTH, canvas.height - bottom - FLOOR_HEIGHT);
}

function drawFloor() {
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);
  ctx.strokeStyle = '#bdb76b';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);
  // Draw Play Game button
  if (!started) {
    const btnWidth = 180;
    const btnHeight = 44;
    const btnX = (canvas.width - btnWidth) / 2;
    const btnY = canvas.height - FLOOR_HEIGHT + 18;
    ctx.fillStyle = '#ffe066';
    ctx.strokeStyle = '#d4a200';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(btnX, btnY, btnWidth, btnHeight);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Play Game', canvas.width / 2, btnY + btnHeight / 2);
  }
}

function resetGame() {
  birdY = canvas.height / 2;
  birdV = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
}

function spawnPipe() {
  const top = Math.random() * (canvas.height - PIPE_GAP - FLOOR_HEIGHT - 80) + 40;
  pipes.push({ x: canvas.width, top, bottom: top + PIPE_GAP, passed: false });
}

function update() {
  if (!started) return;
  birdV += GRAVITY;
  birdY += birdV;

  // Bird collision with floor/ceiling
  if (birdY + BIRD_RADIUS > canvas.height - FLOOR_HEIGHT || birdY - BIRD_RADIUS < 0) {
    gameOver = true;
  }

  // Pipes
  for (let pipe of pipes) {
    pipe.x -= PIPE_SPEED;
    // Collision
    if (
      BIRD_X + BIRD_RADIUS > pipe.x &&
      BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH &&
      (birdY - BIRD_RADIUS < pipe.top || birdY + BIRD_RADIUS > pipe.bottom)
    ) {
      gameOver = true;
    }
    // Score
    if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
      score++;
      pipe.passed = true;
      // Only update high score if not game over
      if (!gameOver && score > highScore) highScore = score;
    }
  }
  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
  // Spawn new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 220) {
    spawnPipe();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background
  ctx.fillStyle = '#4ec0ca';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Pipes
  for (let pipe of pipes) {
    drawPipe(pipe.x, pipe.top, pipe.bottom);
  }
  // Floor
  drawFloor();
  // Bird
  drawBird(birdY);
  // Score
  ctx.font = '32px Arial Black';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';
  ctx.strokeText(score, canvas.width / 2, 80);
  ctx.fillText(score, canvas.width / 2, 80);
  // High Score
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText('High: ' + highScore, canvas.width - 20, 30);
  // Game Over
  if (gameOver) {
    ctx.font = '40px Arial Black';
    ctx.fillStyle = '#ff3333';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2);
  } else if (!started) {
    ctx.font = '32px Arial Black';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 60);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Flap', canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}


document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (!started) started = true;
    if (gameOver) {
      resetGame();
      started = true;
    }
    birdV = FLAP;
    playJumpSound();
  }
});

canvas.addEventListener('click', function(e) {
  if (!started) {
    // Check if click is inside Play Game button
    const btnWidth = 180;
    const btnHeight = 44;
    const btnX = (canvas.width - btnWidth) / 2;
    const btnY = canvas.height - FLOOR_HEIGHT + 18;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (
      mouseX >= btnX && mouseX <= btnX + btnWidth &&
      mouseY >= btnY && mouseY <= btnY + btnHeight
    ) {
      started = true;
      playJumpSound();
    }
  }
});

resetGame();
gameLoop();
