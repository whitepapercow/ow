// 캔버스 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 플레이어 이미지
const playerImage = new Image();
playerImage.src = "assets/player.png";

// 플레이어 속성
const player = {
  x: 100, y: 100,
  vx: 0, vy: 0,
  width: 32, height: 32,
  onGround: false
};

// 키 입력
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// 맵 로드
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

// 카메라
let camera = { x: 0, y: 0 };

function updateCamera() {
  camera.x = player.x - canvas.width / 2 + player.width / 2;
  camera.y = player.y - canvas.height / 2 + player.height / 2;
}

// 생물들
let creatures = [
  { x: 300, y: 400, vx: 1, width: 32, height: 32 }
];

function updateCreatures() {
  for (let c of creatures) {
    c.x += c.vx;
    if (c.x < 200 || c.x > 400) c.vx *= -1;
  }
}

function drawCreatures() {
  for (let c of creatures) {
    ctx.fillStyle = "green";
    ctx.fillRect(c.x, c.y, c.width, c.height);
  }
}

// 충돌 판정
function checkTileCollision(px, py) {
  let tileX = Math.floor(px / tileSize);
  let tileY = Math.floor(py / tileSize);
  if (tileY >= 0 && tileY < map.length && tileX >= 0 && tileX < map[0].length) {
    return map[tileY][tileX] === 1;
  }
  return false;
}

// 날씨와 시간
let time = 0;

function updateTime() {
  time += 1;
}

function drawWeather() {
  if (time % 600 < 300) {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
  }
  ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
}

// 저장 / 불러오기
function saveGame() {
  localStorage.setItem("playerX", player.x);
  localStorage.setItem("playerY", player.y);
}

function loadGame() {
  player.x = parseFloat(localStorage.getItem("playerX")) || 100;
  player.y = parseFloat(localStorage.getItem("playerY")) || 100;
}

// 게임 로직
function update() {
  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -2;
  if (keys["ArrowRight"]) player.vx = 2;
  if (keys[" "] && player.onGround) player.vy = -8;

  player.vy += 0.5; // 중력
  player.x += player.vx;
  player.y += player.vy;

  // 간단한 바닥 충돌
  if (player.y > 500) {
    player.y = 500;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  updateCamera();
  updateCreatures();
  updateTime();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawMap();
  drawCreatures();
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  drawWeather();

  ctx.restore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 시작
loadGame();
gameLoop();
