const width = 9;
const height = 9;

// ===========================================
// ゲームの基本設定
const 縦のマス数 = 8;
const 横のマス数 = 8;
const 持ち駒を使うか = true;
const 駒が成れる段数 = 1;
const 壁マスの座標リスト = [new Cell(4, 3), new Cell(4, 4)];

// ===========================================
// 見た目に関する設定
const 後手の駒を反転させるか = true;
const 先手の駒の色 = "black";
const 後手の駒の色 = "red";
const 駒のフォントサイズ = 24;

const マスの色 = "white";
const 壁マスの色 = "black";
const 選択可能なマスの色 = "yellow";
const マスの境界線 = "1px black solid";
const 壁マスの境界線 = "1px black solid";
const マスの一辺の長さ = 40;

const 先手の持ち駒置き場の色 = "white";
const 後手の持ち駒置き場の色 = "white";
const 先手の持ち駒置き場の境界線 = "1px black solid";
const 後手の持ち駒置き場の境界線 = "1px black solid";

// ===========================================
// 駒の種類

class King extends IPiece {
  get NAME() {
    return "King";
  };
  get SYMBOL() {
    return "K";
  };
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
  IS_ROYAL = true;
}
class Qween extends IPiece {
  get NAME() {
    return "Qween";
  };
  get SYMBOL() {
    return "Q";
  };
  MOVE = new RiderMove(
    new Map([
      [new Vector(1, 0), -1],
      [new Vector(1, 1), -1],
    ]),
    "oct"
  );
}
class Bishop extends IPiece {
  get NAME() {
    return "Bishop";
  };
  get SYMBOL() {
    return "B";
  };
  MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
class Rook extends IPiece {
  get NAME() {
    return "Rook";
  };
  get SYMBOL() {
    return "R";
  };
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct");
}
class Knight extends IPiece {
  get NAME() {
    return "Knight";
  };
  get SYMBOL() {
    return "N";
  };
  MOVE = new LeaperMove([new Vector(1, 2)], "oct");
}
class Pawn extends IPiece {
  get NAME() {
    return "Pawn";
  };
  get SYMBOL() {
    return "P";
  };
  MOVE = new MoveParallelJoint(
    new LeaperMove([new Vector(1, 0)], "none", TInteraction.NO_CAPTURE),
    new LeaperMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
  );
  FORCE_PROMOTE = true;
  get INITIAL_MOVE() {
    return new MoveParallelJoint(
      new RiderMove(
        new Map([[new Vector(1, 0), 2]]),
        "none",
        TInteraction.NO_CAPTURE
      ),
      new LeaperMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
    );
  }
  get PROMOTE_DEFAULT() {return new Set([[Qween], [Bishop], [Rook], [Knight]]);}
}

// ===========================================
// 駒の初期配置

const 初期配置を左右対称にするか = true;
const 初期配置の敵陣へのコピー = "face";
const initialPiece = new Map([
  [new Cell(0, 0), new Rook(PlayerIndex.WHITE)],
  [new Cell(0, 1), new Knight(PlayerIndex.WHITE)],
  [new Cell(0, 2), new Bishop(PlayerIndex.WHITE)],
  [new Cell(0, 3), new King(PlayerIndex.WHITE)],
  [new Cell(0, 4), new Qween(PlayerIndex.WHITE)],
  [new Cell(1, 0), new Pawn(PlayerIndex.WHITE)],
  [new Cell(1, 1), new Pawn(PlayerIndex.WHITE)],
  [new Cell(1, 2), new Pawn(PlayerIndex.WHITE)],
  [new Cell(1, 3), new Pawn(PlayerIndex.WHITE)],
]);

// for test
const pieces = [{ name: "" }, { name: "歩" }];
const capturedPieces = [[], [{ name: "歩", count: 2 }]];

const messageDiv = document.getElementById("メッセージ表示");
const boardTds = boardMatrix();
const capturedPieceDivs = [
  document.getElementById("先手持ち駒置き場"),
  document.getElementById("後手持ち駒置き場"),
];
// 初期化処理();

// ===========================================
// ゲーム制御

// 手番の切り替え時の処理
function startTurn(player) {
  if (player === 0) {
    showMessage("先手の番です。");
  } else {
    showMessage("後手の番です");
  }
}

// ===========================================
// 基本的に変更不要な処理

// 盤面の初期設定
function initializeBoardVisualization() {
  createBoardTable();
  initCapturedPieceDivs();
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
  if (!options.length) {
    throw new Error("no option");
  }
  if (options.length === 1) {
    return options[0];
  }
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

let resolveButtonClick = null;

async function waitButtonClick() {
  return new Promise((resolve) => {
    resolveButtonClick = resolve;
  });
}

function handleBoardClick(value) {
  if (resolveButtonClick !== null) {
    resolveButtonClick(value);
    resetCellColor();
    if (messageDiv.hasChildNodes()) {
      messageDiv.removeChild(messageDiv.firstChild);
    }
  }
}

// マスや持ち駒のクリックによる入力を受付
// 未完成
async function selectBoard(options, message, canCancel) {
  // [number, number][]
  const boardOption = options[0];
  // PieceType[] | undefined
  const pieceOption = options[1];
  // Player | undefined
  const player = options[2];
  showMessage(message);

  // とりあえず各ボタンにonClickをセットする
  // キャンセルボタン
  const button = document.createElement("button");
  if (canCancel) {
    messageDiv.appendChild(button);
    button.textContent = "キャンセル";
    button.onclick = () => handleBoardClick(null);
  }
  // マス
  for (const [i, j] of boardOption) {
    boardTds[i][j].style.backgroundColor = 選択可能なマスの色;
    boardTds[i][j].onclick = () => handleBoardClick([i, j]);
  }
  // 持ち駒
  if (pieceOption) {
    for (let k = 0; k < pieceOption.length; k++) {
      capturedPieceDivs[player === PlayerIndex.WHITE ? 0 : 1].children[
        k
      ].style.backgroundColor = 選択可能なマスの色;
      capturedPieceDivs[player === PlayerIndex.WHITE ? 0 : 1].children[
        k
      ].onclick = () => handleBoardClick(pieceOption[k]);
    }
  }
  // そのあと取り出す
  const result = await waitButtonClick();

  for (let i = 0; i < 縦のマス数; i++) {
    for (let j = 0; j < 横のマス数; j++) {
      boardTds[i][j].onclick = () => {};
    }
  }
  for (const div of capturedPieceDivs[player === PlayerIndex.WHITE ? 0 : 1]
    .children) {
    div.onclick = () => {};
  }

  return result;
}

function resetCellColor() {
  for (let i = 0; i < 縦のマス数; i++) {
    for (let j = 0; j < 横のマス数; j++) {
      if (boardTds[i][j].style.backgroundColor === 選択可能なマスの色) {
        boardTds[i][j].style.backgroundColor = マスの色;
      }
    }
  }
  for (const div of capturedPieceDivs[0].children) {
    div.style.backgroundColor = 先手の持ち駒置き場の色;
  }
  for (const div of capturedPieceDivs[1].children) {
    div.style.backgroundColor = 後手の持ち駒置き場の色;
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
  for (let i = capturedPiecesLength; i < childrenLength; i++) {
    capturedPieceDivs[player].children[i].children[0].textContent = "";
    capturedPieceDivs[player].children[i].children[1].textContent = "";
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
      if (playBoard.board[縦のマス数 - i - 1][j].isExcluded) {
        td.style.backgroundColor = 壁マスの色;
        td.style.border = 壁マスの境界線;
      } else {
        td.style.backgroundColor = マスの色;
        td.style.border = マスの境界線;
      }
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

const playBoard = new MatchBoard(
  {
    initializeBoardVisualization: initializeBoardVisualization,
    startTurnMessaging: startTurn,
    showMessage: showMessage,
    selectBoard: selectBoard,
    selectPromotion: showQuestion,
    renderCell: renderCell,
    renderCapturedPiece: renderCapturedPiece,
  },
  縦のマス数,
  横のマス数,
  initialPiece,
  壁マスの座標リスト,
  持ち駒を使うか,
  TPromotionCondition.oppornentField(駒が成れる段数),
  初期配置を左右対称にするか,
  初期配置の敵陣へのコピー
);

playBoard.game();
