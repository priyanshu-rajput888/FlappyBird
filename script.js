const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ✅ Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bird
let birdX = canvas.width / 4;
let birdY = canvas.height / 2;
let birdSize = 40; // slightly bigger for full screen
let gravity = 0.3;
let velocity = 0;
let jump = -8;
const birdImg = new Image();
birdImg.src = "https://i.ibb.co/vH0rZjq/flappy-bird-red.png";

// Pipes
let pipes = [];
let pipeWidth = 80;
let pipeGap = 200; // larger gap for bigger screen
let pipeSpeed = 3;
let frame = 0;

// Score
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", () => {
  if (!gameOver) {
    velocity = jump;
  } else {
    resetGame();
  }
});

function drawBird() {
  ctx.drawImage(birdImg, birdX, birdY, birdSize, birdSize);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(
      pipe.x,
      pipe.top + pipeGap,
      pipeWidth,
      canvas.height - pipe.top - pipeGap
    );
  });
}

function updatePipes() {
  if (frame % 120 === 0) {
    // slower pipe spawn
    let topHeight = Math.random() * (canvas.height - pipeGap - 200) + 100;
    pipes.push({ x: canvas.width, top: topHeight });
  }
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;
  });
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);
}

function checkCollision() {
  pipes.forEach((pipe) => {
    if (
      birdX < pipe.x + pipeWidth &&
      birdX + birdSize > pipe.x &&
      (birdY < pipe.top || birdY + birdSize > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }
  });
  if (birdY + birdSize > canvas.height || birdY < 0) {
    gameOver = true;
  }
}

function updateScore() {
  pipes.forEach((pipe) => {
    if (!pipe.passed && pipe.x + pipeWidth < birdX) {
      score++;
      pipe.passed = true;
    }
  });
}

function resetGame() {
  birdY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (gameOver) {
    if (score === 0) {
      ctx.fillStyle = "red";
      ctx.font = "40px Arial";
      ctx.fillText(
        "Loser! Good for nothing!",
        canvas.width / 2 - 200,
        canvas.height / 2
      );
    } else {
      ctx.fillText(
        "Game Over! Press any key to restart",
        canvas.width / 2 - 200,
        canvas.height / 2
      );
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  velocity += gravity;
  birdY += velocity;

  if (!gameOver) {
    updatePipes();
    updateScore();
    checkCollision();
  }

  drawBird();
  drawPipes();
  drawScore();

  frame++;
  requestAnimationFrame(gameLoop);
}

birdImg.onload = () => {
  gameLoop();
};

// ✅ Adjust canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resetGame();
});
