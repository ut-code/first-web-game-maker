const shogiPieceTemplates = [
  `class 王将 extends PieceBase {
  NAME = "王将";
  SYMBOL = "王";
  IS_ROYAL = true;
  MOVE = new JumpMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class 金将 extends PieceBase {
  NAME = "金将";
  SYMBOL = "金";
  MOVE = new JumpMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(0, 1), new Vector(-1, 0)],
    "lr"
  );
}
`,
  `class 銀将 extends PieceBase {
  NAME = "銀将";
  SYMBOL = "銀";
  MOVE = new JumpMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(-1, 1)],
    "lr"
  );
}
`,
  `class 桂馬 extends PieceBase {
  NAME = "桂馬";
  SYMBOL = "桂";
  MOVE = new JumpMove([new Vector(2, 1)], "lr");
}
`,
  `class 香車 extends PieceBase {
  NAME = "香車";
  SYMBOL = "香";
  MOVE = new RunMove(new Map([[new Vector(1, 0), -1]]), "none");
}
`,
`class 歩兵 extends PieceBase {
  NAME = "歩兵";
  SYMBOL = "歩";
  MOVE = new JumpMove([new Vector(1, 0)], "none");
}
`,
  `class 飛車 extends PieceBase {
  NAME = "飛車";
  SYMBOL = "飛";
  MOVE = new RunMove(new Map([[new Vector(1, 0), -1]]), "fblr");
}
`,
  `class 角行 extends PieceBase {
  NAME = "角行";
  SYMBOL = "角";
  MOVE = new RunMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
`,
  `class King extends PieceBase {
  NAME = "King";
  SYMBOL = "K";
  IS_ROYAL = true;
  MOVE = new JumpMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class Queen extends PieceBase {
  NAME = "Queen";
  SYMBOL = "Q";
  MOVE = new RunMove(new Map([
    [new Vector(1, 0), -1],
    [new Vector(1, 1), -1],
  ]), "oct");
}
`,
  `class Bishop extends PieceBase {
  NAME = "Bishop";
  SYMBOL = "B";
  MOVE = new RunMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
`,
  `class Rook extends PieceBase {
  NAME = "Rook";
  SYMBOL = "R";
  MOVE = new RunMove(new Map([[new Vector(1, 0), -1]]), "fblr");
}
`,
  `class Knight extends PieceBase {
  NAME = "Knight";
  SYMBOL = "N";
  MOVE = new JumpMove([new Vector(1, 2)], "oct");
}
`,
  `class Pawn extends PieceBase {
  NAME = "Pawn";
  SYMBOL = "P";
  MOVE = new MoveParallelJoint(
    new JumpMove([new Vector(1, 0)], "none", TInteraction.NO_CAPTURE),
    new JumpMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
  );
  INITIAL_MOVE = new MoveParallelJoint(
    new RunMove(
      new Map([[new Vector(1, 1), 2]]),
      "none",
      TInteraction.NO_CAPTURE
    ),
    new JumpMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
  );
}
Pawn.updatePromotion([
  [Qween],
  [Bishop],
  [Rook],
  [Knight],
]);
`,
];

export default shogiPieceTemplates;
