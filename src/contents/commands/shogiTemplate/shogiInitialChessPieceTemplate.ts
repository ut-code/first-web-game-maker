const shogiInitialChessPieceTemplate = `// ===========================================
// 駒の初期配置

const 初期配置を左右対称にするか = true;
const 初期配置の敵陣へのコピー = "face";
const initialPiece = new Map([
  [new Cell(0, 0), new Rook(players[0])],
  [new Cell(0, 1), new Knight(players[0])],
  [new Cell(0, 2), new Bishop(players[0])],
  [new Cell(0, 3), new King(players[0])],
  [new Cell(0, 4), new Qween(players[0])],
  [new Cell(1, 0), new Pawn(players[0])],
  [new Cell(1, 1), new Pawn(players[0])],
  [new Cell(1, 2), new Pawn(players[0])],
  [new Cell(1, 3), new Pawn(players[0])],
]);
`;

export default shogiInitialChessPieceTemplate;
