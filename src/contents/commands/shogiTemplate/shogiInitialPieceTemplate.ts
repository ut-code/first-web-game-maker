const shogiInitialPieceTemplate = `// ===========================================
// 駒の初期配置

const 初期配置を左右対称にするか = true;
const 初期配置の敵陣へのコピー = "face";
const initialPiece = new Map([
  [new Cell(0, 0), new 香車(players[0])],
  [new Cell(0, 1), new 桂馬(players[0])],
  [new Cell(0, 2), new 銀将(players[0])],
  [new Cell(0, 3), new 金将(players[0])],
  [new Cell(0, 4), new 王将(players[0])],
  [new Cell(1, 1), new 角行(players[0])],
  [new Cell(1, 7), new 飛車(players[0])],
  [new Cell(2, 0), new 歩兵(players[0])],
  [new Cell(2, 1), new 歩兵(players[0])],
  [new Cell(2, 2), new 歩兵(players[0])],
  [new Cell(2, 3), new 歩兵(players[0])],
  [new Cell(2, 4), new 歩兵(players[0])],
]);
`;

export default shogiInitialPieceTemplate;
