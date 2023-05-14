const shogiInitialPieceTemplate = `// ===========================================
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
`;

export default shogiInitialPieceTemplate;
