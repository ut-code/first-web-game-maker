// ===========================================
// ゲームの基本設定
const 縦のマス数 = 3;
const 横のマス数 = 3;
const 持ち駒を使うか = true;
const 駒が成れる段数 = 3;
const 壁マスの座標リスト = [];

// 見た目に関する設定
const 後手の駒を反転させるか = true;
const 先手の駒の色 = "black";
const 後手の駒の色 = "black";
const 駒のフォントサイズ = 24;

const マスの色 = "white";
const 壁マスの色 = "black";
const 選択可能なマスの色 = "yellow";
const マスの境界線 = "1px black solid";
const マスの一辺の長さ = 40;

const 先手の持ち駒置き場の色 = "white";
const 後手の持ち駒置き場の色 = "white";
const 先手の持ち駒置き場の境界線 = "1px black solid";
const 後手の持ち駒置き場の境界線 = "1px black solid";

// 盤面の初期設定
function 初期化処理() {}

// ===========================================

const mediatorY = document.getElementById("mediator_y");
const mediatorX = document.getElementById("mediator_x");

function onClickCell(i, j) {
  mediatorY.textContent = i;
  mediatorX.textContent = j;
}

// for test
const currentBoard = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 0],
];
const pieces = [{ name: "" }, { name: "歩" }];
const kari = false;
const capturedPieces = [[], [{ name: "歩", count: 2 }]];

const messageDiv = document.getElementById("メッセージ表示");
const boardTds = boardMatrix();
const capturedPieceDivs = [
  document.getElementById("先手持ち駒置き場"),
  document.getElementById("後手持ち駒置き場"),
];
初期化処理();
startGame();

// ===========================================
// クリックに対する処理

function マスがクリックされた時(y, x) {
  /* ゲームの状態に応じて下3つのどれかに処理を分ける */
}

function 動かす駒の選択(y, x) {
  /* 駒が動けるマスを探索 */
  if (/* 動けるマスがあるか */ kari) {
    /* 移動元の座標と駒の種類を記録しておく */
    showMessage("駒を移動させるマスを選んでください。");
  } else {
    showMessage("その駒は動かせません。");
  }
}

function 駒の移動先の選択(y, x) {
  /* 駒の移動 */
  // マスの描画(移動元x, 移動元y);
  renderCell(y, x);
}

function 持ち駒を置くマスの選択(y, x) {
  /* 駒の設置 */
  renderCell(y, x);
}

function 持ち駒がクリックされた時(player, index) {
  if (index < capturedPieces[player].length) {
    /* 駒が置けるマスを探索 */
    if (/* 置けるマスがあるか */ kari) {
      /* 置こうとしている駒の種類を記録 */
      showMessage("駒を置くマスを選んでください。");
    } else {
      showMessage("駒を置けるマスがありません。");
    }
  }
}

// ===========================================
// ゲーム制御

// 手番の切り替え時の処理
function startTurn(player) {
  showMessage("先手の番です。");
}

// ===========================================
// 基本的に変更不要な処理

// added by Logic section
function initializeBoardVisualization() {
  createBoardTable();
  initCapturedPieceDivs();
}

// ゲーム開始
function startGame() {
  createBoardTable();
  initCapturedPieceDivs();
  for (let i = 0; i < 縦のマス数; i++) {
    for (let j = 0; j < 横のマス数; j++) {
      let pieceId = currentBoard[j][i];
      let pieceName = pieces[pieceId].name;
      renderCell(j, i, 1, pieceName);
    }
  }
  renderCapturedPiece(0, capturedPieces[0]);
  renderCapturedPiece(1, capturedPieces[0]);
  startTurn(0);
}

// ボード型の二次元配列を作成
function boardMatrix(initialValue) {
  const result = Array(縦のマス数);
  for (let i = 0; i < 縦のマス数; i++) {
    result[i] = Array(横のマス数);
    for (let j = 0; j < 横のマス数; j++) {
      result[i][j] = initialValue;
    }
  }
  return result;
}

// メッセージを表示
function showMessage(message) {
  messageDiv.textContent = message;
}

// 選択肢付きの質問を表示
async function showQuestion(options, message) {
  messageDiv.textContent = message;
  const buttons = options.map((option) => {
    const button = document.createElement("button");
    messageDiv.appendChild(button);
    button.textContent = option.toString();
    button.style.marginLeft = "5px";
    return button;
  });
  return new Promise((resolve) => {
    buttons.forEach((button, index) => {
      button.onclick = () => {
        resolve(options[index]); // 必要であれば修正してください
        while (messageDiv.childElementCount > 0) {
          messageDiv.removeChild(messageDiv.lastChild);
        }
      };
    });
  });
}
// lookup PieceType => 箱: .Symbol
// マスや持ち駒のクリックによる入力を受付
// 未完成
async function selectBoard(options, message, canCancel) {
  const boardOption = options[0];
  const pieceOption = options[1];
  showMessage(message);
  return new Promise((resolve) => {
    // キャンセルボタン
    const button = document.createElement("button");
    if (canCancel) {
      messageDiv.appendChild(button);
      button.textContent = "キャンセル";
      button.onclick = () => handleBoardClick(resolve /* TODO */);
    }
    // マス
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (/* TODO 選択可能か */ kari) {
          tds[i][j].style.backgroundColor = 選択可能なマスの色;
          tds[i][j].onclick = () => handleBoardClick(resolve /* TODO */);
        }
      }
    }
    // 持ち駒
    // TODO player
    for (const capturedPieceDiv of capturedPieceDivs[player]) {
      capturedPieceDiv.onclick = () => handleBoardClick(resolve /* TODO */);
    }
  });
}

function handleBoardClick(resolve, response) {
  resolve(response);
  resetCellColor();
  if (messageDiv.hasChildNodes()) {
    messageDiv.removeChild(messageDiv.firstChild);
  }
}

function resetCellColor() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (playBoard.squere(AbsoluteCoordinate(i, j)).isExcluded) {
        tds[i][j].backgroundColor = 壁マスの色;
      } else {
        tds[i][j].backgroundColor = マスの色;
      }
    }
  }
}

// 駒をマスに描画
// TODO pieces, currentBoard
function renderCell(y, x, player, pieceName) {
  const td = boardTds[y][x];
  if (player === 0) {
    td.style.color = 先手の駒の色;
    td.style.transform = "rotate(0deg)";
  } else {
    td.style.color = 後手の駒の色;
    if (後手の駒を反転させるか) {
      td.style.transform = "rotate(180deg)";
    }
  }
  td.textContent = pieceName;
}

// 持ち駒を描画
// TODO capturedPieces, pieces
function renderCapturedPiece(player, pieceNameAndNum) {
  const childrenLength = capturedPieceDivs[player].children.length;
  const capturedPiecesLength = pieceNameAndNum.length;
  if (childrenLength < capturedPiecesLength) {
    // 不足分のdiv要素を生成
    for (let i = childrenLength; i < capturedPiecesLength; i++) {
      createCapturedPieceColumn(capturedPieceDivs[player], player, i);
    }
  }

  for (let i = 0; i < capturedPiecesLength; i++) {
    capturedPieceDivs[player].children[i].children[0].textContent =
      pieceNameAndNum[i].name;
    capturedPieceDivs[player].children[
      i
    ].children[1].textContent = ` x ${pieceNameAndNum[i].count}`;
  }
}

// 盤面を生成
function createBoardTable() {
  const boardDiv = document.getElementById("盤面");
  const table = document.createElement("table");
  boardDiv.appendChild(table);
  table.style.borderCollapse = "collapse";
  table.style.textAlign = "center";

  for (let i = 0; i < 縦のマス数; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < 横のマス数; j++) {
      const td = document.createElement("td");
      tr.appendChild(td);
      td.style.height = `${マスの一辺の長さ}px`;
      td.style.width = `${マスの一辺の長さ}px`;
      td.style.fontSize = `${駒のフォントサイズ}px`;
      td.style.backgroundColor = マスの色;
      td.style.border = マスの境界線;
      td.onclick = () => {
        onClickCell(i, j);
      };
      boardTds[i][j] = td;
    }
  }
}

// 持ち駒置き場を初期化
function initCapturedPieceDivs() {
  if (持ち駒を使うか) {
    capturedPieceDivs[0].style.backgroundColor = 先手の持ち駒置き場の色;
    capturedPieceDivs[0].style.border = 先手の持ち駒置き場の境界線;
    capturedPieceDivs[1].style.backgroundColor = 後手の持ち駒置き場の色;
    capturedPieceDivs[1].style.border = 後手の持ち駒置き場の境界線;
    capturedPieceDivs.forEach((capturedPieceDiv, index) => {
      capturedPieceDiv.style.width = `${マスの一辺の長さ * 2}px`;
      capturedPieceDiv.style.textAlign = "center";
      for (let i = 0; i < 縦のマス数; i++) {
        createCapturedPieceColumn(capturedPieceDiv, index, i);
      }
    });
  } else {
    const container = document.getElementById("container");
    container.removeChild(capturedPieceDivs[1]);
    container.removeChild(capturedPieceDivs[0]);
  }
}

// 1つの持ち駒を表示するdiv要素を生成
function createCapturedPieceColumn(capturedPieceDiv, player, index) {
  const div = document.createElement("div");
  capturedPieceDiv.appendChild(div);
  div.onclick = () => {
    持ち駒がクリックされた時(player, index);
  };
  div.style.height = `${マスの一辺の長さ}px`;
  const pieceNameSpan = document.createElement("span");
  div.appendChild(pieceNameSpan);
  const pieceCountSpan = document.createElement("span");
  div.appendChild(pieceCountSpan);

  pieceNameSpan.style.fontSize = `${駒のフォントサイズ}px`;
  pieceNameSpan.style.display = "inline-block";
  pieceCountSpan.style.fontSize = `${駒のフォントサイズ / 1.5}px`;
  if (player === 0) {
    pieceNameSpan.style.color = 先手の駒の色;
    pieceCountSpan.style.color = 先手の駒の色;
  } else {
    pieceNameSpan.style.color = 後手の駒の色;
    pieceCountSpan.style.color = 後手の駒の色;
    if (後手の駒を反転させるか) {
      pieceNameSpan.style.transform = "rotate(180deg)";
    }
  }
}

async function test1() {
  const a = await showQuestion(["a", "b"], "test");
  console.log(a);
}
test1();
