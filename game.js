//기초코드
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 100, y: 100,
  vx: 0, vy: 0,
  width: 32, height: 32,
  onGround: false
};

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -2;
  if (keys["ArrowRight"]) player.vx = 2;
  if (keys[" "] && player.onGround) player.vy = -8;

  player.vy += 0.5; // gravity
  player.x += player.vx;
  player.y += player.vy;

  // 단순 바닥 충돌
  if (player.y > 500) {
    player.y = 500;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 플레이어
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

