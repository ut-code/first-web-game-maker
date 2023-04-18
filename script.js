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
function drawPacman(x, y) {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(x, y, roadWidth / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
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

// 四方のマスに移動可能かどうかを判定
// function canMoveFrom(x, y) {
//   return {
//     north: canMoveNorth(x, y),
//     south: canMoveSouth(x, y),
//     east: canMoveEast(x, y),
//     west: canMoveWest(x, y),
//   };
// }

// function canMoveFrom() {
//   return {
//     north: canMoveNorth(),
//     south: canMoveSouth(),
//     east: canMoveEast(),
//     west: canMoveWest(),
//   };
// }

// ここでいい感じに端点をはんていすればいい
function canMoveFrom() {
  // まだ境界
  const [northBorder, southBorder, eastBorder, westBorder] = [
    indexY(pacmanPosition.y + 1 - roadWidth / 2),
    indexY(pacmanPosition.y - 1 + roadWidth / 2),
    indexX(pacmanPosition.x - 1 + roadWidth / 2),
    indexX(pacmanPosition.x + 1 - roadWidth / 2),
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

  // const isMovingNorthSouth =

  if (northBorder === centerY && southBorder === centerY) {
    if (wall[centerY][centerX + 1] === 0) {
      result.east = true;
    } else if (eastBorder === centerX && westBorder === centerX) {
      result.east = false;
    }
    if (wall[centerY][centerX - 1] === 0) {
      result.west = true;
    } else if (eastBorder === centerX && westBorder === centerX) {
      result.west = false;
    }
  } else {
    result.east = false;
    result.west = false;
  }
  if (eastBorder === centerX && westBorder === centerX) {
    if (wall[centerY - 1][centerX] === 0) {
      result.north = true;
    } else if (northBorder === centerY && southBorder === centerY) {
      result.north = false;
    }
    if (wall[centerY + 1][centerX] === 0) {
      result.south = true;
    } else if (northBorder === centerY && southBorder === centerY) {
      result.south = false;
    }
  } else {
    result.north = false;
    result.south = false;
  }
  console.log(result);
  return result;
}

// function canMoveNorth() {
//   const now = nowIndex();
//   const north = now.y - 1;
//   const east = now.x + 1;
//   const west = now.x - 1;

//   if (north < 0) {
//     return false;
//   }
//   if (wall[north][east] === 1 || wall[north][west] === 1) {
//     console.log(`[cmNorth] north: ${north}, east: ${east}, west: ${west}`);
//     return false;
//   }
//   return true;
// }

// function canMoveSouth() {
//   const now = nowIndex();
//   const south = now.y + 1;
//   const east = now.x + 1;
//   const west = now.x - 1;

//   if (south > wall.length - 1) {
//     return false;
//   }
//   if (wall[south][east] === 1 || wall[south][west] === 1) {
//     return false;
//   }
//   return true;
// }

// function canMoveEast() {
//   const now = nowIndex();
//   const north = now.y - 1;
//   const south = now.y + 1;
//   const east = now.x + 1;
//   console.log(
//     `[cmEast] now: ${now}, north: ${north}, east: ${east}, south: ${south}`
//   );

//   if (east > wall[0].length - 1) {
//     console.log("east over");
//     return false;
//   }
//   if (wall[now.y][east] === 1) {
//     console.log("east wall");
//     return false;
//   }
//   console.log("east ok");
//   return true;
// }

// function canMoveWest() {
//   const now = nowIndex();
//   const north = now.y - 1;
//   const south = now.y + 1;
//   const west = now.x - 1;

//   if (west < 0) {
//     return false;
//   }
//   if (wall[north][west] === 1 || wall[south][west] === 1) {
//     return false;
//   }
//   return true;
// }

// console.log(x + roadWidth / 2);
// console.log(`north=${northBorder}, east=${eastBorder}, west=${westBorder}`);
// console.log(
//   `${wall[northBorder - 1][eastBorder]}、${wall[northBorder - 1][westBorder]}`
// );
// console.log(x - roadWidth / 2);
// console.log(wall[northBorder - 1][eastBorder]);
// console.log(wall[northBorder - 1][westBorder]);

// 4端点を見る必要がある。
// function canMoveNorth(x, y) {
//   [northBorder, southBorder, eastBorder, westBorder] = [
//     indexY(y - 1 - roadWidth / 2),
//     indexY(y + roadWidth / 2),
//     indexX(x - 1 + roadWidth / 2),
//     indexX(x + 1 - roadWidth / 2),
//   ];

//   console.log(x + roadWidth / 2);
//   console.log(
//     `north=${northBorder}, south=${southBorder}, east=${eastBorder}, west=${westBorder}`
//   );
//   console.log(
//     `${wall[northBorder][eastBorder]}、${wall[northBorder][westBorder]}`
//   );
//   console.log(x - roadWidth / 2);
//   console.log(wall[northBorder][eastBorder]);
//   console.log(wall[northBorder][westBorder]);

//   if (northBorder > 0) {
//     if (
//       wall[northBorder][eastBorder] === 0 &&
//       wall[northBorder][westBorder] === 0
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// function canMoveSouth(x, y) {
//   [northBorder, southBorder, eastBorder, westBorder] = [
//     indexY(y + roadWidth / 2),
//     indexY(y - roadWidth / 2),
//     indexX(x - 1 + roadWidth / 2),
//     indexX(x + 1 - roadWidth / 2),
//   ];

//   if (southBorder < wall.length - 1) {
//     if (
//       wall[southBorder + 1][eastBorder] === 0 &&
//       wall[southBorder + 1][westBorder] === 0
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// old
// function canMoveSouth(x, y) {
//   southBorder = y - roadWidth / 2;
//   const indexX = Math.floor((x / canvas.width) * wall[0].length);
//   const indexY = Math.floor((southBorder / canvas.height) * wall.length);

//   if (indexY < wall.length - 1) {
//     if (wall[indexY + 1][indexX] === 0) {
//       return true;
//     }
//   }
//   return false;
// }

// function canMoveEast(x, y) {
//   eastBorder = x - roadWidth / 2;
//   const indexX = Math.floor((eastBorder / canvas.width) * wall[0].length);
//   const indexY = Math.floor((y / canvas.height) * wall.length);

//   if (indexX < wall[0].length - 1) {
//     if (wall[indexY][indexX + 1] === 0) {
//       return true;
//     }
//   }
//   return false;
// }

// function canMoveWest(x, y) {
//   westBorder = x + roadWidth / 2;
//   const indexX = Math.floor((westBorder / canvas.width) * wall[0].length);
//   const indexY = Math.floor((y / canvas.height) * wall.length);

//   if (indexX > 0) {
//     if (wall[indexY][indexX - 1] === 0) {
//       return true;
//     }
//   }
//   return false;
// }

// function ifTouchCookie() {
//   for (let i = 0; i < 10; i++) {
//     for (let j = 0; j < 5; j++) {
//       if (
//         pacmanPosition.x <= 80 + 40 * i &&
//         pacmanPosition.x >= 70 + 40 * i &&
//         pacmanPosition.y <= 55 + 40 * j &&
//         pacmanPosition.y >= 45 + 40 * j
//       ) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   }
// }
