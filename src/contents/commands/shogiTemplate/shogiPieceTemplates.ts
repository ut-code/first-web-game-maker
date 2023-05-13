const shogiPieceTemplates = [
  `class 駒の名前 extends IPiece {
  NAME = "駒の名前";
  SYMBOL = "駒";
  MOVE = new LeaperMove([new Vector(1, 0)], "none");
}
`,
  `class 王将 extends IPiece {
  NAME = "王将";
  SYMBOL = "王";
  IS_ROYAL = true;
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class 飛車 extends IPiece {
  NAME = "飛車";
  SYMBOL = "飛";
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct");
}
class 竜王 extends IPiece {
  NAME = "竜王";
  SYMBOL = "竜";
  MOVE = new MergedMove(
    new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct"),
    new LeaperMove([new Vector(1, 1)], "fblr")
  );
}
飛車.updatePromotion([[竜王]]);
`,
  `class 角行 extends IPiece {
  NAME = "角行";
  SYMBOL = "角";
  MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
class 竜馬 extends IPiece {
  NAME = "竜馬";
  SYMBOL = "馬";
  MOVE = new MergedMove(
    new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr"),
    new LeaperMove([new Vector(1, 0)], "oct")
  );
}
角行.updatePromotion([[竜馬]]);
`,
  `class 金将 extends IPiece {
  NAME = "金将";
  SYMBOL = "金";
  MOVE = new LeaperMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(0, 1), new Vector(-1, 0)],
    "lr"
  );
}
`,
  `class 銀将 extends IPiece {
  NAME = "銀将";
  SYMBOL = "銀";
  MOVE = new LeaperMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(-1, 1)],
    "lr"
  );
}
銀将.updatePromotion([[金将]]);
`,
  `class 桂馬 extends IPiece {
  NAME = "桂馬";
  SYMBOL = "桂";
  MOVE = new LeaperMove([new Vector(2, 1)], "lr");
}
桂馬.updatePromotion([[金将]]);
`,
  `class 香車 extends IPiece {
  NAME = "香車";
  SYMBOL = "香";
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "none");
}
香車.updatePromotion([[金将]]);
`,
  `class 歩兵 extends IPiece {
  NAME = "歩兵";
  SYMBOL = "歩";
  MOVE = new LeaperMove([new Vector(1, 0)], "none");
}
歩兵.updatePromotion([[金将]]);
`,
  `class King extends IPiece {
  NAME = "King";
  SYMBOL = "K";
  IS_ROYAL = true;
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class Queen extends IPiece {
  NAME = "Queen";
  SYMBOL = "Q";
  MOVE = new RiderMove(new Map([
    [new Vector(1, 0), -1],
    [new Vector(1, 1), -1],
  ]), "oct");
}
`,
  `class Bishop extends IPiece {
  NAME = "Bishop";
  SYMBOL = "B";
  MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
`,
  `class Rook extends IPiece {
  NAME = "Rook";
  SYMBOL = "R";
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "fblr");
}
`,
  `class Knight extends IPiece {
  NAME = "Knight";
  SYMBOL = "N";
  MOVE = new LeaperMove([new Vector(1, 2)], "oct");
}
`,
  `class Pawn extends IPiece {
  NAME = "Pawn";
  SYMBOL = "P";
  MOVE = new MergedMove(
    new LeaperMove([new Vector(1, 0)], "none", TInteraction.NO_CAPTURE),
    new LeaperMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
  );
  INITIAL_MOVE = new MergedMove(
    new RiderMove(
      new Map([[new Vector(1, 1), 2]]),
      "none",
      TInteraction.NO_CAPTURE
    ),
    new LeaperMove([new Vector(1, 1)], "lr", TInteraction.ONLY_CAPTURE)
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
