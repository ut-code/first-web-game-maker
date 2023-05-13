const wall = `
const mazeState = [
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

// ************************************************
// canvas領域を定義
const canvas = document.getElementById("canvas");
const roadWidth = 50; // 道幅を指定
canvas.width = roadWidth * mazeState[0].length;
canvas.height = roadWidth * mazeState.length;
const ctx = canvas.getContext("2d");
// ************************************************

// 背景を描く関数
function drawContext() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 迷路の状態 (ここでは壁があるかどうか) を描く関数
function drawMazeState() {
  ctx.fillStyle = "navy";
  for (let i = 0; i < mazeState.length; i++) {
    for (let j = 0; j < mazeState[i].length; j++) {
      if (mazeState[i][j] === "x") {
        ctx.fillRect(roadWidth * j, roadWidth * i, roadWidth, roadWidth);
      }
    }
  }
}

drawContext();
drawMazeState();
`;
export default wall;
