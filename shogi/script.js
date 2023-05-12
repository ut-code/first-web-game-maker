// ===========================================
// ゲームの基本設定
const 縦のマス数 = 3;
const 横のマス数 = 3;
const 持ち駒を使うか = true;

// 見た目に関する設定
const 後手の駒を反転させるか = true;
const 先手の駒の色 = "black";
const 後手の駒の色 = "black";
const 駒のフォントサイズ = 24;

const マスの色 = "white";
const 選択可能なマスの色 = "yellow";
const マスの境界線 = "1px black solid";
const マスの縦の長さ = 40;
const マスの横の長さ = 40;

const 先手の持ち駒置き場の色 = "white";
const 後手の持ち駒置き場の色 = "white";
const 先手の持ち駒置き場の境界線 = "1px black solid";
const 後手の持ち駒置き場の境界線 = "1px black solid";

// 盤面の初期設定
function 初期化処理() {}

// ===========================================

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

function マスがクリックされた時(x, y) {
  /* ゲームの状態に応じて下3つのどれかに処理を分ける */
}

function 盤面の駒が選ばれた時(x, y) {
  /* 駒が動けるマスを探索 */
  if (/* 動けるマスがあるか */ kari) {
    /* 移動元の座標と駒の種類を記録しておく */
    showMessage("駒を移動させるマスを選んでください。");
  } else {
    showMessage("その駒は動かせません。");
  }
}

function 駒の移動先が選ばれた時(x, y) {
  /* 駒の移動 */
  // マスの描画(移動元x, 移動元y);
  renderCell(x, y);
}

function 持ち駒を置くマスが選ばれた時(x, y) {
  /* 駒の設置 */
  renderCell(x, y);
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

// ゲーム開始
function startGame() {
  createBoardTable();
  initCapturedPieceDivs();
  for (let i = 0; i < 縦のマス数; i++) {
    for (let j = 0; j < 横のマス数; j++) {
      renderCell(j, i);
    }
  }
  renderCapturedPiece(0);
  renderCapturedPiece(1);
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

// 駒をマスに描画
// TODO pieces, currentBoard
function renderCell(x, y) {
  let pieceId = currentBoard[y][x];
  const td = boardTds[y][x];
  if (/* TODO 1Pの駒かどうか */ kari) {
    td.style.color = 先手の駒の色;
    td.style.transform = "rotate(0deg)";
  } else {
    td.style.color = 後手の駒の色;
    if (後手の駒を反転させるか) {
      td.style.transform = "rotate(180deg)";
    }
  }
  td.textContent = pieces[pieceId].name;
}

// 持ち駒を描画
// TODO capturedPieces, pieces
function renderCapturedPiece(player) {
  const childrenLength = capturedPieceDivs[player].children.length;
  const capturedPiecesLength = capturedPieces[player].length;
  if (childrenLength < capturedPiecesLength) {
    // 不足分のdiv要素を生成
    for (let i = childrenLength; i < capturedPiecesLength; i++) {
      createCapturedPieceColumn(capturedPieceDivs[player], player, i);
    }
  }

  for (let i = 0; i < capturedPiecesLength; i++) {
    capturedPieceDivs[player].children[i].children[0].textContent =
      capturedPieces[player][i].name;
    capturedPieceDivs[player].children[
      i
    ].children[1].textContent = ` x ${capturedPieces[player][i].count}`;
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
      td.style.height = `${マスの縦の長さ}px`;
      td.style.width = `${マスの横の長さ}px`;
      td.style.fontSize = `${駒のフォントサイズ}px`;
      td.style.backgroundColor = マスの色;
      td.style.border = マスの境界線;
      td.onclick = () => {
        マスがクリックされた時(j, i);
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
      capturedPieceDiv.style.width = `${マスの横の長さ * 2}px`;
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
  div.style.height = `${マスの縦の長さ}px`;
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
