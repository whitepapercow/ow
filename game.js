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

//맵이랑 타일 기반 구조
let map = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0]
];

const tileSize = 64;

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "brown";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

//카메라 시스템
let camera = { x: 0, y: 0 };

function updateCamera() {
  camera.x = player.x - canvas.width / 2 + player.width / 2;
  camera.y = player.y - canvas.height / 2 + player.height / 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawMap();

  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();
}

//생물 기본ai
let creatures = [
  { x: 300, y: 400, vx: 1, width: 32, height: 32 }
];

function updateCreatures() {
  for (let c of creatures) {
    c.x += c.vx;
    // 좌우 왔다갔다
    if (c.x < 200 || c.x > 400) c.vx *= -1;
  }
}

function drawCreatures() {
  for (let c of creatures) {
    ctx.fillStyle = "green";
    ctx.fillRect(c.x, c.y, c.width, c.height);
  }
}

//충돌판정
function checkTileCollision(px, py) {
  let tileX = Math.floor(px / tileSize);
  let tileY = Math.floor(py / tileSize);
  if (tileY >= 0 && tileY < map.length && tileX >= 0 && tileX < map[0].length) {
    return map[tileY][tileX] === 1;
  }
  return false;
}

//날씨시간
let time = 0;

function updateTime() {
  time += 1;
}

function drawWeather() {
  if (time % 600 < 300) {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
  }
}

//저장 불러오기
function saveGame() {
  localStorage.setItem("playerX", player.x);
  localStorage.setItem("playerY", player.y);
}

function loadGame() {
  player.x = parseFloat(localStorage.getItem("playerX")) || 100;
  player.y = parseFloat(localStorage.getItem("playerY")) || 100;
}

