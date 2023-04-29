//モジュール化

// canvasの座標を反転させてから扱ってもいいかも

// const wall = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
//   [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];

// 迷路のサイズ
const size = 12;

let cookiePoint = 0;

// 壁の初期設定（もっと綺麗に書けるはず）
// "x"は壁、"o"はクッキー、"-"は空白

const wall = new Array(size / 2);
wall[0] = new Array(size).fill("x");
for (let i = 1; i < size / 2 - 1; i++) {
  wall[i] = new Array(size).fill("o");
  wall[i][0] = "x";
  wall[i][size - 1] = "x";
}
wall[size / 2 - 1] = new Array(size).fill("x");

const pacmanResult = {
  north: true,
  south: true,
  east: true,
  west: true,
};

const enemyResult = {
  north: true,
  south: true,
  east: true,
  west: true,
};

const tableDiv = document.getElementById("table");
const nowDirectionDiv = document.getElementById("now-direction");
const nextDirectionDiv = document.getElementById("next-direction");
const cookiePointSpan = document.getElementById("cookie-point");

const pacmanImage = new Image();
pacmanImage.src = "./img/pacman.svg";
const enemyImage = new Image();
enemyImage.src = "./img/ghost.svg";

// canvas領域を定義
const canvas = document.getElementById("canvas");
canvas.width = size * 50;
canvas.height = size * 25; // とりあえず縦横比1:2
const ctx = canvas.getContext("2d");
const roadWidth = canvas.width / wall[0].length;

// let lastTime = performance.now();
const pacmanPosition = { x: 75, y: 75 }; //最初の出現位置を動的に指定するように修正の必要あり
const enemyPosition = { x: 525, y: 225 };
// const nextDirection = { x: 0, y: 0 };
let nextDirection;
let nowDirection;

let enemyNextDirection;
let enemyNowDirection;

// 開始
createWall();
drawContext();
drawWall();
// drawPacman(pacmanPosition.x, pacmanPosition.y);
// drawEnemy(100, 100);
movePacman();

// キーボード操作を取得
document.onkeydown = onKeyDown;

// Enemy の動作
setEnemyDirection();

// 入力を元に壁を生成
function createWall() {
  tableDiv.innerHTML = "";
  const table = document.createElement("table");
  for (let i = 0; i < size / 2; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < size; j++) {
      const td = document.createElement("td");
      td.style.width = "40px";
      td.style.height = "40px";
      if (wall[i][j] === "x") {
        td.style.backgroundColor = "blue";
      } else {
        td.style.backgroundColor = "black";
      }
      td.onclick = () => {
        wall[i][j] = wall[i][j] === "o" ? "x" : "o";
        createWall();
      };
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  tableDiv.appendChild(table);
}

// 背景描画
function drawContext() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 壁描画
function drawWall() {
  ctx.strokeStyle = "blue";

  // border collapse的な処理をする

  for (let i = 0; i < wall.length; i++) {
    for (let j = 0; j < wall[i].length; j++) {
      if (wall[i][j] === "x") {
        ctx.strokeRect(roadWidth * j, roadWidth * i, roadWidth, roadWidth);
      } else if (wall[i][j] === "o") {
        drawCookie(i, j);
      } else if (wall[i][j] === "-") {
        // empty
      }
    }
  }
}

// パックマン描画
// SVG化できたらする
// function drawPacman(x, y) {
//   ctx.fillStyle = "yellow";
//   ctx.beginPath();
//   ctx.arc(x, y, roadWidth / 2, 0, Math.PI * 2, true);
//   ctx.closePath();
//   ctx.fill();
// }

function drawPacman(x, y) {
  // ctx.fillStyle = "yellow";
  // ctx.beginPath();
  ctx.drawImage(pacmanImage, x - 30, y - 30, 65, 65);
  // 位置調整　ハードコーディングしない
}

function drawEnemy(x, y) {
  // ctx.fillStyle = "red";
  // ctx.beginPath();
  // ctx.arc(x, y, 30, 0, Math.PI * 2, true);
  // ctx.closePath();
  // ctx.fill();
  ctx.drawImage(enemyImage, x - 30, y - 30, 65, 65);
  // 位置調整　ハードコーディングしない
}

function drawCookie(i, j) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    roadWidth * j + roadWidth / 2,
    roadWidth * i + roadWidth / 2,
    5,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  ctx.fill();
}

// function removeCookie(x, y) {
//   ctx.fillStyle = "black";
//   ctx.fillRect(x - 5, y - 5, 10, 10);
// }

// パックマンの移動・再描画
function movePacman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const canMove = canMoveFrom(pacmanPosition, pacmanResult);
  const enemyCanMove = canMoveFrom(enemyPosition, enemyResult);

  // パックマンを動かす
  if (nextDirection === "north" && canMove.north) {
    nowDirection = "north";
  } else if (nextDirection === "south" && canMove.south) {
    nowDirection = "south";
  } else if (nextDirection === "east" && canMove.east) {
    nowDirection = "east";
  } else if (nextDirection === "west" && canMove.west) {
    nowDirection = "west";
  }
  if (nowDirection === "north" && canMove.north) {
    pacmanPosition.y -= 1;
  } else if (nowDirection === "south" && canMove.south) {
    pacmanPosition.y += 1;
  } else if (nowDirection === "east" && canMove.east) {
    pacmanPosition.x += 1;
  } else if (nowDirection === "west" && canMove.west) {
    pacmanPosition.x -= 1;
  }

  // 敵を動かす
  if (enemyNextDirection === "north" && enemyCanMove.north) {
    enemyNowDirection = "north";
  } else if (enemyNextDirection === "south" && enemyCanMove.south) {
    enemyNowDirection = "south";
  } else if (enemyNextDirection === "east" && enemyCanMove.east) {
    enemyNowDirection = "east";
  } else if (enemyNextDirection === "west" && enemyCanMove.west) {
    enemyNowDirection = "west";
  }
  if (enemyNowDirection === "north" && enemyCanMove.north) {
    enemyPosition.y -= 1;
  } else if (enemyNowDirection === "south" && enemyCanMove.south) {
    enemyPosition.y += 1;
  } else if (enemyNowDirection === "east" && enemyCanMove.east) {
    enemyPosition.x += 1;
  } else if (enemyNowDirection === "west" && enemyCanMove.west) {
    enemyPosition.x -= 1;
  }

  eraseCookie();
  hitEnemy();

  drawContext();
  drawWall();
  drawPacman(pacmanPosition.x, pacmanPosition.y);
  drawEnemy(enemyPosition.x, enemyPosition.y);

  // debug
  nowDirectionDiv.textContent = `now: ${nowDirection}`;
  nextDirectionDiv.textContent = `next: ${nextDirection}`;

  cookiePointSpan.textContent = cookiePoint;

  setTimeout(() => {
    movePacman();
  }, 10);

  // 速度がブラウザ依存になっているのをなおす必要がある
  //   const interval = performance.now() - lastTime;
  //   lastTime = performance.now();
}

// 矢印キーで移動
function onKeyDown(e) {
  if (e.keyCode === 37) {
    // west
    nextDirection = "west";
  }
  if (e.keyCode === 38) {
    // north
    nextDirection = "north";
  }
  if (e.keyCode === 39) {
    // east
    nextDirection = "east";
  }
  if (e.keyCode === 40) {
    // south
    nextDirection = "south";
  }
}

// 敵の動く方向をランダムに生成
// ちゃんとそれっぽく動かす必要がある
function setEnemyDirection() {
  const canMove = canMoveFrom(enemyPosition, enemyResult);
  const directions = [];
  canMove.north ? directions.push("north") : null;
  canMove.south ? directions.push("south") : null;
  canMove.east ? directions.push("east") : null;
  canMove.west ? directions.push("west") : null;

  console.log("directions", directions);
  enemyNextDirection =
    directions[Math.floor(Math.random() * directions.length)];
  const interval = Math.random() * 2000 + 1000;
  setTimeout(() => {
    setEnemyDirection();
  }, interval);
}

// canvas上のx座標をwallのindexに変換
function indexX(x) {
  return Math.floor((x / canvas.width) * wall[0].length);
}
// canvas上のy座標をwallのindexに変換
function indexY(y) {
  return Math.floor((y / canvas.height) * wall.length);
}

// ここでいい感じに端点をはんていすればいい
function canMoveFrom(position, result) {
  const minusMargin = 1;
  // まだ境界
  const [northBorder, southBorder, eastBorder, westBorder] = [
    indexY(position.y + minusMargin - roadWidth / 2),
    indexY(position.y - minusMargin + roadWidth / 2),
    indexX(position.x - minusMargin + roadWidth / 2),
    indexX(position.x + minusMargin - roadWidth / 2),
  ];

  const centerX = indexX(position.x);
  const centerY = indexY(position.y);

  // console.log(
  //   northBorder,
  //   southBorder,
  //   centerY,
  //   eastBorder,
  //   westBorder,
  //   centerX
  // );

  const isMovingEastWest = northBorder === centerY && southBorder === centerY;
  const isMovingNorthSouth = eastBorder === centerX && westBorder === centerX;

  // console.log(
  //   `isMovingEastWest: ${isMovingEastWest}, isMovingNorthSouth: ${isMovingNorthSouth}`
  // );

  // 明らかに冗長なのでなおす
  if (isMovingEastWest) {
    result.east = true;
    result.west = true;
    if (wall[centerY][centerX + 1] !== "x") {
      result.east = true;
    } else if (isMovingNorthSouth) {
      result.east = false;
    }
    if (wall[centerY][centerX - 1] !== "x") {
      result.west = true;
    } else if (isMovingNorthSouth) {
      result.west = false;
    }
  } else {
    result.east = false;
    result.west = false;
  }
  if (isMovingNorthSouth) {
    result.north = true;
    result.south = true;
    if (wall[centerY - 1][centerX] !== "x") {
      result.north = true;
    } else if (isMovingEastWest) {
      result.north = false;
    }
    if (wall[centerY + 1][centerX] !== "x") {
      result.south = true;
    } else if (isMovingEastWest) {
      result.south = false;
    }
  } else {
    result.north = false;
    result.south = false;
  }
  // console.log(result);
  return result;
}

function eraseCookie() {
  // pacmanの大きさが相まっていい感じだが、本来ちゃんと当たり判定をやる必要がある
  const centerX = indexX(pacmanPosition.x);
  const centerY = indexY(pacmanPosition.y);
  if (wall[centerY][centerX] === "o") {
    wall[centerY][centerX] = "-";
    cookiePoint += 1;
  }
}

function hitEnemy() {
  const centerX = indexX(pacmanPosition.x);
  const centerY = indexY(pacmanPosition.y);

  const enemyCenterX = indexX(enemyPosition.x);
  const enemyCenterY = indexY(enemyPosition.y);

  if (wall[centerY][centerX] === wall[enemyCenterY][enemyCenterX]) {
    alert("Game Over!");
  }
}
