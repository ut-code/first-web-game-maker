// ===========================================
// 参加者が変更可能な部分

// 迷路のサイズ
const size = 20;

// ===========================================
// initialize
let eatenCookie = 0;
let createdCookie = 0;

// ===========================================
// maze template
// "x"は壁、"o"はクッキー、"-"は空白

// template #1
const mazeState = createStandardMaze20();
// const mazeState = createPlaneMaze(size);

// ===========================================
const pacmanState = {
  north: true,
  south: true,
  east: true,
  west: true,
};

const ghostState = {
  north: true,
  south: true,
  east: true,
  west: true,
};

const tableDiv = document.getElementById("table");
const nowDirectionDiv = document.getElementById("now-direction");
const nextDirectionDiv = document.getElementById("next-direction");
const eatenCookieSpan = document.getElementById("cookie-point");

const pacmanEastImage = new Image();
pacmanEastImage.src = "./img/pacman_east.svg";
const pacmanWestImage = new Image();
pacmanWestImage.src = "./img/pacman_west.svg";
const pacmanNorthImage = new Image();
pacmanNorthImage.src = "./img/pacman_north_temp.svg";
const pacmanSouthImage = new Image();
pacmanSouthImage.src = "./img/pacman_south_temp.svg";

const enemyEastImage = new Image();
enemyEastImage.src = "./img/ghost_east.svg";
const enemyWestImage = new Image();
enemyWestImage.src = "./img/ghost_west.svg";
const enemyNorthImage = new Image();
enemyNorthImage.src = "./img/ghost_north.svg";
const enemySouthImage = new Image();
enemySouthImage.src = "./img/ghost_south.svg";

// canvas領域を定義
const canvas = document.getElementById("canvas");
const roadWidth = 50; // まだ50でしか動かない
canvas.width = roadWidth * mazeState[0].length;
canvas.height = roadWidth * mazeState.length;
const ctx = canvas.getContext("2d");

// let lastTime = performance.now();
const pacmanPosition = { x: 75, y: 75 }; //最初の出現位置を動的に指定するように修正の必要あり
const enemyPosition = { x: 525, y: 225 };
let nextDirection;
let nowDirection;

let enemyNextDirection;
let enemyNowDirection;

// 開始
createMazeState();
drawContext();
drawMazeState();
// drawPacman(pacmanPosition.x, pacmanPosition.y);
// drawEnemy(100, 100);
movePacman();

// キーボード操作を取得
document.onkeydown = onKeyDown;

// Enemy の動作
setEnemyDirection();

// 入力を元に壁を生成
function createMazeState() {
  tableDiv.innerHTML = "";
  const table = document.createElement("table");
  for (let i = 0; i < size / 2; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < size; j++) {
      const td = document.createElement("td");
      td.style.width = "40px";
      td.style.height = "40px";
      if (mazeState[i][j] === "x") {
        td.style.backgroundColor = "blue";
      } else {
        td.style.backgroundColor = "black";
      }
      td.onclick = () => {
        mazeState[i][j] = mazeState[i][j] === "o" ? "x" : "o";
        createMazeState();
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
function drawMazeState() {
  ctx.strokeStyle = "blue";
  for (let i = 0; i < mazeState.length; i++) {
    for (let j = 0; j < mazeState[i].length; j++) {
      if (mazeState[i][j] === "x") {
        ctx.strokeRect(roadWidth * j, roadWidth * i, roadWidth, roadWidth);
      } else if (mazeState[i][j] === "o") {
        drawCookie(i, j);
      } else if (mazeState[i][j] === "-") {
        // empty
      }
    }
  }
}

function drawPacman(pacmanImage, x, y) {
  ctx.drawImage(pacmanImage, x - 30, y - 30, 65, 65);
  // 位置調整　ハードコーディングしない
}

function drawEnemy(enemyImage, x, y) {
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

// パックマンの移動・再描画
function movePacman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const canMove = canMoveFrom(pacmanPosition, pacmanState);
  const enemyCanMove = canMoveFrom(enemyPosition, ghostState);

  // パックマンを動かす
  let pacmanImage;
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
    pacmanImage = pacmanNorthImage;
  } else if (nowDirection === "south" && canMove.south) {
    pacmanPosition.y += 1;
    pacmanImage = pacmanSouthImage;
  } else if (nowDirection === "east" && canMove.east) {
    pacmanPosition.x += 1;
    pacmanImage = pacmanEastImage;
  } else if (nowDirection === "west" && canMove.west) {
    pacmanPosition.x -= 1;
    pacmanImage = pacmanWestImage;
  }

  // 敵を動かす
  let enemyImage;
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
    enemyImage = enemyNorthImage;
  } else if (enemyNowDirection === "south" && enemyCanMove.south) {
    enemyPosition.y += 1;
    enemyImage = enemySouthImage;
  } else if (enemyNowDirection === "east" && enemyCanMove.east) {
    enemyPosition.x += 1;
    enemyImage = enemyEastImage;
  } else if (enemyNowDirection === "west" && enemyCanMove.west) {
    enemyPosition.x -= 1;
    enemyImage = enemyWestImage;
  }

  hitCookie();
  hitEnemy();
  judgeGameClear();

  drawContext();
  drawMazeState();
  drawPacman(
    pacmanImage || pacmanEastImage,
    pacmanPosition.x,
    pacmanPosition.y
  );
  drawEnemy(enemyImage || enemyEastImage, enemyPosition.x, enemyPosition.y);

  // debug
  nowDirectionDiv.textContent = `now: ${nowDirection}`;
  nextDirectionDiv.textContent = `next: ${nextDirection}`;

  eatenCookieSpan.textContent = eatenCookie * 10;

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
  const canMove = canMoveFrom(enemyPosition, ghostState);
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

// canvas上のx座標をmazeStateのindexに変換
function indexX(x) {
  return Math.floor((x / canvas.width) * mazeState[0].length);
}
// canvas上のy座標をmazeStateのindexに変換
function indexY(y) {
  return Math.floor((y / canvas.height) * mazeState.length);
}

function canMoveFrom(position, result) {
  const minusMargin = 1;
  const [northBorder, southBorder, eastBorder, westBorder] = [
    indexY(position.y + minusMargin - roadWidth / 2),
    indexY(position.y - minusMargin + roadWidth / 2),
    indexX(position.x - minusMargin + roadWidth / 2),
    indexX(position.x + minusMargin - roadWidth / 2),
  ];

  const centerX = indexX(position.x);
  const centerY = indexY(position.y);

  const isMovingEastWest = northBorder === centerY && southBorder === centerY;
  const isMovingNorthSouth = eastBorder === centerX && westBorder === centerX;

  // 明らかに冗長なのでなおす
  if (isMovingEastWest) {
    result.east = true;
    result.west = true;
    if (mazeState[centerY][centerX + 1] !== "x") {
      result.east = true;
    } else if (isMovingNorthSouth) {
      result.east = false;
    }
    if (mazeState[centerY][centerX - 1] !== "x") {
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
    if (mazeState[centerY - 1][centerX] !== "x") {
      result.north = true;
    } else if (isMovingEastWest) {
      result.north = false;
    }
    if (mazeState[centerY + 1][centerX] !== "x") {
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

function hitCookie() {
  // pacmanの大きさが相まっていい感じだが、本来ちゃんと当たり判定をやる必要がある
  const centerX = indexX(pacmanPosition.x);
  const centerY = indexY(pacmanPosition.y);
  if (mazeState[centerY][centerX] === "o") {
    mazeState[centerY][centerX] = "-";
    eatenCookie += 1;
  }
}

function hitEnemy() {
  const centerX = indexX(pacmanPosition.x);
  const centerY = indexY(pacmanPosition.y);

  const enemyCenterX = indexX(enemyPosition.x);
  const enemyCenterY = indexY(enemyPosition.y);

  if (centerY === enemyCenterY && centerX === enemyCenterX) {
    if (confirm("Game Over!")) {
      console.log("ok");
      // 処理を停止する必要がある
      location.reload();
    }
  }
}

function judgeGameClear() {
  if (eatenCookie === createdCookie) {
    setTimeout(() => {
      if (confirm("Game Clear!")) {
        console.log("ok");
        // 処理を停止する必要がある
        location.reload();
      }
    }, 200);
  }
}

// ===================
// create maze template
// 外壁のみ
// function createPlaneMaze(size) {
//   const mazeState = new Array(size / 2);
//   mazeState[0] = new Array(size).fill("x");
//   for (let i = 1; i < size / 2 - 1; i++) {
//     mazeState[i] = new Array(size).fill("o");
//     mazeState[i][0] = "x";
//     mazeState[i][size - 1] = "x";
//   }
//   mazeState[size / 2 - 1] = new Array(size).fill("x");
//   return mazeState;
// }

function createStandardMaze20() {
  createdCookie = 88;
  return [
    [
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
    ],
    [
      "x",
      "-",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "x",
    ],
    [
      "x",
      "o",
      "x",
      "x",
      "x",
      "x",
      "o",
      "x",
      "x",
      "o",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "o",
      "x",
    ],
    [
      "x",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "x",
      "o",
      "o",
      "o",
      "o",
      "x",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "x",
    ],
    [
      "x",
      "o",
      "x",
      "x",
      "x",
      "x",
      "o",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "o",
      "x",
      "x",
      "x",
      "o",
      "x",
      "x",
    ],
    [
      "x",
      "o",
      "o",
      "o",
      "x",
      "x",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "x",
    ],
    [
      "x",
      "o",
      "x",
      "o",
      "o",
      "x",
      "o",
      "x",
      "o",
      "x",
      "o",
      "x",
      "x",
      "o",
      "x",
      "x",
      "x",
      "o",
      "x",
      "x",
    ],
    [
      "x",
      "o",
      "x",
      "x",
      "o",
      "x",
      "x",
      "x",
      "o",
      "x",
      "o",
      "o",
      "o",
      "o",
      "x",
      "o",
      "o",
      "o",
      "x",
      "x",
    ],
    [
      "x",
      "o",
      "o",
      "o",
      "o",
      "o",
      "o",
      "x",
      "o",
      "o",
      "o",
      "x",
      "x",
      "o",
      "x",
      "o",
      "x",
      "o",
      "o",
      "x",
    ],
    [
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
      "x",
    ],
  ];
}
