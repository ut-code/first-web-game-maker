// ===========================================
// ゲームの基本設定
const height = 3;
const width = 3;
const canUseCapturedPiece = true;

// 見た目に関する設定
const doRotate2pPiece = true;
const piece1pColor = "black";
const piece2pColor = "black";
const defaultCellBgColor = "white";
const selectableCellBgColor = "yellow";
const capturedPieceDivBgColor = "white";
const cellBorder = "1px black solid";
const capturedPieceDivBorder = "1px black solid";
const cellHeight = 40;
const cellWidth = 40;
const pieceSymbolSize = 24;

// 盤面の初期設定
function initialize() {}

// ===========================================

// for test
const currentBoard = [
  [1,1,1],
  [1,0,1],
  [1,0,0],
];
const pieces = [{name: ""},{name: "歩"}];
const kari = false;

const messageDiv = document.getElementById("メッセージ表示");
const boardTds = boardMatrix();
const capturedPieceDivs = [
  document.getElementById("先手持ち駒置き場"),
  document.getElementById("後手持ち駒置き場"),
];
const capturedPieces = [[], []];
initialize();
startGame();


// ===========================================
// クリックに対する処理

// マスをクリックした時
function onClickCell(x, y) {
  /* ゲームの状態に応じて下3つのどれかに処理を分ける */
}

// 盤面の駒を選んだ時
function handleSelectPiece(x, y) {
  /* 駒が動けるマスを探索 */
  if(/* 動けるマスがあるか */ kari) {
    /* 移動元の座標と駒の種類を記録しておく */
    showMessage("駒を移動させるマスを選んでください。");
  } else {
    showMessage("その駒は動かせません。");
  }
}

// 駒の移動先を選んだ時
function handleMovePiece(x, y) {
  /* 駒の移動 */
  // renderCell(移動元x, 移動元y);
  renderCell(x, y);
}

// 持ち駒の置き先を選んだ時
function handlePlacePiece(x, y) {
  /* 駒の設置 */
  renderCell(x, y);
}

// 持ち駒をクリックした時
function onClickCapturedPiece(player, index) {
  if (index < capturedPieces[player].length) {
    /* 駒が置けるマスを探索 */
    if(/* 置けるマスがあるか */ kari) {
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
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      renderCell(i, j);
    }
  }
  renderCapturedPiece(0);
  renderCapturedPiece(1);
  startTurn(0);
}

// ボード型の二次元配列を作成
function boardMatrix(initialValue) {
  const result = Array(height);
  for (let i = 0; i < height; i++) {
    result[i] = Array(width);
    for (let j = 0; j < width; j++) {
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
  let pieceId = currentBoard[x][y];
  const td = boardTds[x][y];
  if (/* TODO 1Pの駒かどうか */ kari) {
    td.style.color = piece1pColor;
    td.style.transform = "rotate(0deg)";
  } else {
    td.style.color = piece2pColor;
    if (doRotate2pPiece) {
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

  for (let i = 0; i < height; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < width; j++) {
      const td = document.createElement("td");
      tr.appendChild(td);
      td.style.height = `${cellHeight}px`;
      td.style.width = `${cellWidth}px`;
      td.style.fontSize = `${pieceSymbolSize}px`;
      td.style.backgroundColor = defaultCellBgColor;
      td.style.border = cellBorder;
      td.onclick = () => {
        onClickCell(i, j);
      };
      boardTds[i][j] = td;
    }
  }
}

// 持ち駒置き場を初期化
function initCapturedPieceDivs() {
  if (canUseCapturedPiece) {
    capturedPieceDivs.forEach((capturedPieceDiv, index) => {
      capturedPieceDiv.style.width = `${cellWidth * 2}px`;
      capturedPieceDiv.style.backgroundColor = capturedPieceDivBgColor;
      capturedPieceDiv.style.border = capturedPieceDivBorder;
      capturedPieceDiv.style.textAlign = "center";
      for (let i = 0; i < height; i++) {
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
    onClickCapturedPiece(player, index);
  };
  div.style.height = `${cellHeight}px`;
  const pieceNameSpan = document.createElement("span");
  div.appendChild(pieceNameSpan);
  const pieceCountSpan = document.createElement("span");
  div.appendChild(pieceCountSpan);

  pieceNameSpan.style.fontSize = `${pieceSymbolSize}px`;
  pieceNameSpan.style.display = "inline-block";
  pieceCountSpan.style.fontSize = `${pieceSymbolSize / 2}px`;
  if (player === 0) {
    pieceNameSpan.style.color = piece1pColor;
    pieceCountSpan.style.color = piece1pColor;
  } else {
    pieceNameSpan.style.color = piece2pColor;
    pieceCountSpan.style.color = piece2pColor;
    if (doRotate2pPiece) {
      pieceNameSpan.style.transform = "rotate(180deg)";
    }
  }
}
