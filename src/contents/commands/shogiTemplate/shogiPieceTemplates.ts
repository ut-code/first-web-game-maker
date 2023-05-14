const shogiPieceTemplates = [
  `class 駒の名前 extends IPiece {
  get NAME() {
    return "駒の名前";
  }
  get SYMBOL() {
    return "駒";
  }
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class 王将 extends IPiece {
  get NAME() {
    return "王将";
  }
  get SYMBOL() {
    return "王";
  }
  IS_ROYAL = true;
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
}
`,
  `class 飛車 extends IPiece {
  get NAME() {
    return "飛車";
  }
  get SYMBOL() {
    return "飛";
  }
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct");
  get PROMOTE_DEFAULT() {
    return new Set([[竜王]]);
  }
}
class 竜王 extends IPiece {
  get NAME() {
    return "竜王";
  }
  get SYMBOL() {
    return "竜";
  }
  MOVE = new MoveParallelJoint(
    new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct"),
    new LeaperMove([new Vector(1, 1)], "fblr")
  );
}
`,
  `class 角行 extends IPiece {
  get NAME() {
    return "角行";
  }
  get SYMBOL() {
    return "角";
  }
  MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");
  get PROMOTE_DEFAULT() {
    return new Set([[竜馬]]);
  }
}
class 竜馬 extends IPiece {
  get NAME() {
    return "竜馬";
  }
  get SYMBOL() {
    return "馬";
  }
  MOVE = new MoveParallelJoint(
    new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr"),
    new LeaperMove([new Vector(1, 0)], "oct")
  );
}
`,
  `class 金将 extends IPiece {
  get NAME() {
    return "金将";
  }
  get SYMBOL() {
    return "金";
  }
  MOVE = new LeaperMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(0, 1), new Vector(-1, 0)],
    "lr"
  );
}
`,
  `class 銀将 extends IPiece {
  get NAME() {
    return "銀将";
  }
  get SYMBOL() {
    return "銀";
  }
  MOVE = new LeaperMove(
    [new Vector(1, 0), new Vector(1, 1), new Vector(-1, 1)],
    "lr"
  );
  get PROMOTE_DEFAULT() {
    return new Set([[金将]]);
  }
}
`,
  `class 桂馬 extends IPiece {
  get NAME() {
    return "桂馬";
  }
  get SYMBOL() {
    return "桂";
  }
  MOVE = new LeaperMove([new Vector(2, 1)], "lr");
  get PROMOTE_DEFAULT() {
    return new Set([[金将]]);
  }
}
`,
  `class 香車 extends IPiece {
  get NAME() {
    return "香車";
  }
  get SYMBOL() {
    return "香";
  }
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "none");
  get PROMOTE_DEFAULT() {
    return new Set([[金将]]);
  }
}
`,
  `class 歩兵 extends IPiece {
  get NAME() {
    return "歩兵";
  }
  get SYMBOL() {
    return "歩";
  }
  MOVE = new LeaperMove([new Vector(1, 0)], "none");
  get PROMOTE_DEFAULT() {
    return new Set([[金将]]);
  }
}
`,
  `class King extends IPiece {
  get NAME() {
    return "King";
  }
  get SYMBOL() {
    return "K";
  }
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
  IS_ROYAL = true;
}
`,
  `class Qween extends IPiece {
  get NAME() {
    return "Qween";
  }
  get SYMBOL() {
    return "Q";
  }
  MOVE = new RiderMove(
    new Map([
      [new Vector(1, 0), -1],
      [new Vector(1, 1), -1],
    ]),
    "oct"
  );
}
`,
  `class Bishop extends IPiece {
  get NAME() {
    return "Bishop";
  }
  get SYMBOL() {
    return "B";
  }
  MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");
}
`,
  `class Rook extends IPiece {
  get NAME() {
    return "Rook";
  }
  get SYMBOL() {
    return "R";
  }
  MOVE = new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct");
}
`,
  `class Knight extends IPiece {
  get NAME() {
    return "Knight";
  }
  get SYMBOL() {
    return "N";
  }
  MOVE = new LeaperMove([new Vector(1, 2)], "oct");
}
`,
  `class Pawn extends IPiece {
  get NAME() {
    return "Pawn";
  }
  get SYMBOL() {
    return "P";
  }
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
  get PROMOTE_DEFAULT() {
    return new Set([[Qween], [Bishop], [Rook], [Knight]]);
  }
}
`,
];

export default shogiPieceTemplates;
