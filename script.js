// canvasの座標を反転させてから扱ってもいいかも

// 壁の位置を定義
// 通路を広くする
wall = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const result = {
  north: true,
  south: true,
  east: true,
  west: true,
};

const pacmanImage = new Image();
pacmanImage.src = "./img/pacman.svg";

// canvas領域を定義
const canvas = document.getElementById("canvas");
canvas.width = "500";
canvas.height = canvas.width * 0.5; // とりあえず縦横比1:2
const ctx = canvas.getContext("2d");
const roadWidth = canvas.width / wall[0].length;

// let lastTime = performance.now();
const pacmanPosition = { x: 75, y: 75 }; //最初の出現位置を動的に指定するように修正の必要あり
const nextDirection = { x: 0, y: 0 };

// 開始
drawContext();
drawWall();
drawPacman(pacmanPosition.x, pacmanPosition.y);
movePacman();

// キーボード操作を取得
document.onkeydown = onKeyDown;

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
      if (wall[i][j] === 1) {
        ctx.strokeRect(roadWidth * j, roadWidth * i, roadWidth, roadWidth);
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

// function drawEnemy(x, y) {
//   ctx.fillStyle = "red";
//   ctx.beginPath();
//   ctx.arc(x, y, 30, 0, Math.PI * 2, true);
//   ctx.closePath();
//   ctx.fill();
// }

// function drawCookie(x, y) {
//   ctx.fillStyle = "white";
//   ctx.beginPath();
//   ctx.arc(x, y, 5, 0, Math.PI * 2, true);
//   ctx.closePath();
//   ctx.fill();
// }

// function removeCookie(x, y) {
//   ctx.fillStyle = "black";
//   ctx.fillRect(x - 5, y - 5, 10, 10);
// }

// パックマンの移動・再描画
function movePacman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const canMove = canMoveFrom(pacmanPosition.x, pacmanPosition.y);
  if (canMove.north && nextDirection.y === -1) {
    pacmanPosition.y -= 1;
  }
  if (canMove.south && nextDirection.y === 1) {
    pacmanPosition.y += 1;
  }
  if (canMove.east && nextDirection.x === 1) {
    pacmanPosition.x += 1;
  }
  if (canMove.west && nextDirection.x === -1) {
    pacmanPosition.x -= 1;
  }

  drawContext();
  drawWall();
  drawPacman(pacmanPosition.x, pacmanPosition.y);

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
    // left
    nextDirection.x = -1;
    nextDirection.y = 0;
  }
  if (e.keyCode === 38) {
    // up
    nextDirection.x = 0;
    nextDirection.y = -1;
  }
  if (e.keyCode === 39) {
    // right
    nextDirection.x = 1;
    nextDirection.y = 0;
  }
  if (e.keyCode === 40) {
    // down
    nextDirection.x = 0;
    nextDirection.y = 1;
  }
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
function canMoveFrom() {
  const minusMargin = 1;
  // まだ境界
  const [northBorder, southBorder, eastBorder, westBorder] = [
    indexY(pacmanPosition.y + minusMargin - roadWidth / 2),
    indexY(pacmanPosition.y - minusMargin + roadWidth / 2),
    indexX(pacmanPosition.x - minusMargin + roadWidth / 2),
    indexX(pacmanPosition.x + minusMargin - roadWidth / 2),
  ];

  const centerX = indexX(pacmanPosition.x);
  const centerY = indexY(pacmanPosition.y);

  console.log(
    northBorder,
    southBorder,
    centerY,
    eastBorder,
    westBorder,
    centerX
  );

  const isMovingEastWest = northBorder === centerY && southBorder === centerY;
  const isMovingNorthSouth = eastBorder === centerX && westBorder === centerX;

  console.log(
    `isMovingEastWest: ${isMovingEastWest}, isMovingNorthSouth: ${isMovingNorthSouth}`
  );

  // 明らかに冗長なのでなおす
  if (isMovingEastWest) {
    result.east = true;
    result.west = true;
    if (wall[centerY][centerX + 1] === 0) {
      result.east = true;
    } else if (isMovingNorthSouth) {
      result.east = false;
    }
    if (wall[centerY][centerX - 1] === 0) {
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
    if (wall[centerY - 1][centerX] === 0) {
      result.north = true;
    } else if (isMovingEastWest) {
      result.north = false;
    }
    if (wall[centerY + 1][centerX] === 0) {
      result.south = true;
    } else if (isMovingEastWest) {
      result.south = false;
    }
  } else {
    result.north = false;
    result.south = false;
  }
  console.log(result);
  return result;
}
