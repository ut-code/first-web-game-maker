const shogiPieceTemplate = `class 駒の名前 extends IPiece {
  NAME = "駒の名前";
  SYMBOL = "駒";
  IS_ROYAL = false;
  MOVE = new LeaperMove(
    [new RelativeCoordinate(1, 0), new RelativeCoordinate(1, 1)],
    "oct"
  );
}
`;

export default shogiPieceTemplate;
