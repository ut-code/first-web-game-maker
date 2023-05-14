const templateJsAll = `const mazeState = [
    ["x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"],
    ["x","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","x"],
    ["x","o","x","x","x","x","o","x","x","o","x","x","x","x","x","x","x","x","o","x"],
    ["x","o","o","o","o","o","o","x","o","o","o","o","x","o","o","o","o","o","o","x"],
    ["x","o","x","x","x","x","o","x","x","x","x","x","x","o","x","x","x","o","x","x"],
    ["x","o","o","o","x","x","o","o","o","o","o","o","o","o","o","o","o","o","o","x"],
    ["x","o","x","o","o","x","o","x","o","x","o","x","x","o","x","x","x","o","x","x"],
    ["x","o","x","x","o","x","x","x","o","x","o","o","o","o","x","o","o","o","x","x"],
    ["x","o","o","o","o","o","o","x","o","o","o","x","x","o","x","o","x","o","o","x"],
    ["x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"],
];

let pacmanPositionX = 75;
let pacmanPositionY = 75;
let nextDirection;
let nowDirection;

let ghostPositionX = 525;
let ghostPositionY = 225;

let ghostNextDirection;
let ghostNowDirection;

const contextColor = "black";
const wallColor = "navy";
const cookieColor = "white";

// ************************************************

let eatenCookie = 0;
let createdCookie = 88;

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

const eatenCookieSpan = document.getElementById("eaten-cookie");
const createdCookieSpan = document.getElementById("created-cookie");

const pacmanEastImage = new Image();
pacmanEastImage.src = "./img/pacman_east.svg";
const pacmanWestImage = new Image();
pacmanWestImage.src = "./img/pacman_west.svg";
const pacmanNorthImage = new Image();
pacmanNorthImage.src = "./img/pacman_north_temp.svg";
const pacmanSouthImage = new Image();
pacmanSouthImage.src = "./img/pacman_south_temp.svg";

const ghostEastImage = new Image();
ghostEastImage.src = "./img/ghost_east.svg";
const ghostWestImage = new Image();
ghostWestImage.src = "./img/ghost_west.svg";
const ghostNorthImage = new Image();
ghostNorthImage.src = "./img/ghost_north.svg";
const ghostSouthImage = new Image();
ghostSouthImage.src = "./img/ghost_south.svg";

// canvas領域を定義
const canvas = document.getElementById("canvas");
const roadWidth = 50; // 道幅を指定
canvas.width = roadWidth * mazeState[0].length;
canvas.height = roadWidth * mazeState.length;
const ctx = canvas.getContext("2d");

// 背景を描く関数
function drawContext() {
  ctx.fillStyle = contextColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 迷路の状態 (ここでは壁があるかどうか) を描く関数
function drawMazeState() {
  for (let i = 0; i < mazeState.length; i++) {
    for (let j = 0; j < mazeState[i].length; j++) {
      if (mazeState[i][j] === "x") {
        ctx.fillStyle = wallColor;
        ctx.fillRect(roadWidth * j, roadWidth * i, roadWidth, roadWidth);
      } else if (mazeState[i][j] === "o") {
        drawCookie(i, j);
      }
    }
  }
}

function drawPacman(pacmanImage, x, y) {
  ctx.drawImage(pacmanImage, x - 30, y - 30, 65, 65);
}

function drawGhost(ghostImage, x, y) {
  ctx.drawImage(ghostImage, x - 30, y - 30, 65, 65);
}

function drawCookie(i, j) {
  ctx.fillStyle = cookieColor;
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
  const canMove = canMoveFrom(pacmanPositionX, pacmanPositionY, pacmanState);
  const ghostCanMove = canMoveFrom(ghostPositionX, ghostPositionY, ghostState);

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
    pacmanPositionY -= 1;
    pacmanImage = pacmanNorthImage;
  } else if (nowDirection === "south" && canMove.south) {
    pacmanPositionY += 1;
    pacmanImage = pacmanSouthImage;
  } else if (nowDirection === "east" && canMove.east) {
    pacmanPositionX += 1;
    pacmanImage = pacmanEastImage;
  } else if (nowDirection === "west" && canMove.west) {
    pacmanPositionX -= 1;
    pacmanImage = pacmanWestImage;
  }

  // 敵を動かす
  let ghostImage;
  if (ghostNextDirection === "north" && ghostCanMove.north) {
    ghostNowDirection = "north";
  } else if (ghostNextDirection === "south" && ghostCanMove.south) {
    ghostNowDirection = "south";
  } else if (ghostNextDirection === "east" && ghostCanMove.east) {
    ghostNowDirection = "east";
  } else if (ghostNextDirection === "west" && ghostCanMove.west) {
    ghostNowDirection = "west";
  }
  if (ghostNowDirection === "north" && ghostCanMove.north) {
    ghostPositionY -= 1;
    ghostImage = ghostNorthImage;
  } else if (ghostNowDirection === "south" && ghostCanMove.south) {
    ghostPositionY += 1;
    ghostImage = ghostSouthImage;
  } else if (ghostNowDirection === "east" && ghostCanMove.east) {
    ghostPositionX += 1;
    ghostImage = ghostEastImage;
  } else if (ghostNowDirection === "west" && ghostCanMove.west) {
    ghostPositionX -= 1;
    ghostImage = ghostWestImage;
  }

  checkCookieHit();
  checkGhostHit();
  judgeGameClear();

  drawContext();
  drawMazeState();
  drawPacman(pacmanImage || pacmanEastImage, pacmanPositionX, pacmanPositionY);
  drawGhost(ghostImage || ghostEastImage, ghostPositionX, ghostPositionY);

  eatenCookieSpan.textContent = eatenCookie * 10;
  createdCookieSpan.textContent = createdCookie * 10;

  setTimeout(() => {
    movePacman();
  }, 10);
}

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

function setGhostDirection() {
  const canMove = canMoveFrom(ghostPositionX, ghostPositionY, ghostState);
  const directions = [];
  canMove.north ? directions.push("north") : null;
  canMove.south ? directions.push("south") : null;
  canMove.east ? directions.push("east") : null;
  canMove.west ? directions.push("west") : null;
  ghostNextDirection =
    directions[Math.floor(Math.random() * directions.length)];
  const interval = Math.random() * 2000 + 1000;
  setTimeout(() => {
    setGhostDirection();
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

function canMoveFrom(positionX, positionY, result) {
  const minusMargin = 1;
  const [northBorder, southBorder, eastBorder, westBorder] = [
    indexY(positionY + minusMargin - roadWidth / 2),
    indexY(positionY - minusMargin + roadWidth / 2),
    indexX(positionX - minusMargin + roadWidth / 2),
    indexX(positionX + minusMargin - roadWidth / 2),
  ];

  const centerX = indexX(positionX);
  const centerY = indexY(positionY);

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
  return result;
}

function checkCookieHit() {
  const centerX = indexX(pacmanPositionX);
  const centerY = indexY(pacmanPositionY);
  if (mazeState[centerY][centerX] === "o") {
    mazeState[centerY][centerX] = "-";
    eatenCookie += 1;
  }
}

function checkGhostHit() {
  const centerX = indexX(pacmanPositionX);
  const centerY = indexY(pacmanPositionY);

  const ghostCenterX = indexX(ghostPositionX);
  const ghostCenterY = indexY(ghostPositionY);

  if (centerY === ghostCenterY && centerX === ghostCenterX) {
    if (confirm("Game Over!")) {
      location.reload();
    }
  }
}

function judgeGameClear() {
  if (eatenCookie === createdCookie) {
    setTimeout(() => {
      if (confirm("Game Clear!")) {
        location.reload();
      }
    }, 200);
  }
}

movePacman();
document.onkeydown = onKeyDown;
setGhostDirection();

// ************************************************
`;

export default templateJsAll;
