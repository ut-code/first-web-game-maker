"use strict";
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f) {
      throw new TypeError("Private accessor was defined without a getter");
    }
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    ) {
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    }
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") {
      throw new TypeError("Private method is not writable");
    }
    if (kind === "a" && !f) {
      throw new TypeError("Private accessor was defined without a setter");
    }
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    ) {
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    }
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _AbsoluteCoordinate_instances,
  _AbsoluteCoordinate_normalizer,
  _LeaperMove_coordinates,
  _RiderMove_coordinatesToDist,
  _MatchBoard_instances,
  _MatchBoard_movablePieceMapCache,
  _MatchBoard_coordsGenerator_get,
  _MatchBoard_isGameTerminated_get,
  _MatchBoard_addPieceToStand,
  _MatchBoard_addPieceToBoard,
  _MatchBoard_removePieceFromStand,
  _MatchBoard_removePieceFromBoard,
  _MatchBoard_moveDestinationFrom,
  _MatchBoard_dropDestination,
  _MatchBoard_updateMovablePieceMap,
  _MatchBoard_currentMovablePieceMap_get,
  _MatchBoard_move,
  _MatchBoard_drop,
  _MatchBoard_promote,
  _MatchBoard_coordToNum,
  _MatchBoard_numToCoord;
class DefaultDict extends Map {
  constructor(defaultFactory, iterable) {
    super(iterable);
    this.defaultFactory = defaultFactory;
  }
  get(key) {
    const value = super.get(key);
    return value === undefined ? this.defaultFactory() : value;
  }
  apply(key, callbackfn) {
    return this.set(key, callbackfn(this.get(key)));
  }
}
class Counter extends DefaultDict {
  constructor(iterable) {
    super(() => 0, iterable);
  }
}
const coordCatalog = new Map();
class Coordinate {
  constructor(y, x) {
    this.y = y;
    this.x = x;
    const key = `${this.constructor.name}(${y === -0 ? 0 : y}, ${
      x === -0 ? 0 : x
    })`;
    if (coordCatalog.has(key)) {
      return coordCatalog.get(key);
    }
    coordCatalog.set(key, this);
  }
  toString() {
    return `${this.constructor.name}${(this.y, this.x)}`;
  }
  add(coord) {
    return new this.constructor(this.y + coord.y, this.x + coord.x);
  }
  eq(coord) {
    return this.y === coord.y && this.x === coord.x;
  }
}
class AbsoluteCoordinate extends Coordinate {
  constructor() {
    super(...arguments);
    _AbsoluteCoordinate_instances.add(this);
  }
  get xInverted() {
    return new AbsoluteCoordinate(this.y, -this.x - 1);
  }
  get yInverted() {
    return new AbsoluteCoordinate(-this.y - 1, this.x);
  }
  get fullInverted() {
    return new AbsoluteCoordinate(-this.y - 1, -this.x - 1);
  }
  isInside(board, strict = true) {
    if (strict) {
      return (
        0 <= this.y &&
        this.y < board.height &&
        0 <= this.x &&
        this.x < board.width
      );
    }
    return (
      -board.height <= this.y &&
      this.y < board.height &&
      -board.width <= this.x &&
      this.x < board.width
    );
  }
  normalizedBy(board, negative = false) {
    if (!this.isInside(board, false)) {
      throw RangeError(
        `${this.toString()} is out of the board ${(board.height, board.width)}`
      );
    }
    return new AbsoluteCoordinate(
      __classPrivateFieldGet(
        this,
        _AbsoluteCoordinate_instances,
        "m",
        _AbsoluteCoordinate_normalizer
      ).call(this, this.y, board.height, negative),
      __classPrivateFieldGet(
        this,
        _AbsoluteCoordinate_instances,
        "m",
        _AbsoluteCoordinate_normalizer
      ).call(this, this.x, board.width, negative)
    );
  }
}
(_AbsoluteCoordinate_instances = new WeakSet()),
  (_AbsoluteCoordinate_normalizer = function _AbsoluteCoordinate_normalizer(
    target,
    standard,
    negative = false
  ) {
    if (negative) {
      if (target >= 0) {
        return target - standard;
      }
    } else if (target < 0) {
      return target + standard;
    }
    return target;
  });
class RelativeCoordinate extends Coordinate {
  get xInverted() {
    return new RelativeCoordinate(this.y, -this.x);
  }
  get yInverted() {
    return new RelativeCoordinate(-this.y, this.x);
  }
  get fullInverted() {
    return new RelativeCoordinate(-this.y, -this.x);
  }
  get upsideRight() {
    return new RelativeCoordinate(this.x, this.y);
  }
  get upsideLeft() {
    return new RelativeCoordinate(-this.x, -this.y);
  }
}
class PlayerIndex {
  static relation(self, value) {
    if (value === undefined) {
      return Relation.TO_BLANK;
    }
    if (value !== this.WHITE && value !== this.BLACK) {
      throw new TypeError();
    }
    if (self === value) {
      return Relation.FRIEND;
    }
    return Relation.ENEMY;
  }
  static nextPlayer(self) {
    if (self === PlayerIndex.WHITE) {
      return PlayerIndex.BLACK;
    }
    if (self === PlayerIndex.BLACK) {
      return PlayerIndex.WHITE;
    }
    throw new Error("next turn of absent");
  }
}
PlayerIndex.WHITE = Symbol("White");
PlayerIndex.BLACK = Symbol("Black");
const Relation = {
  TO_BLANK: Symbol("To blank"),
  FRIEND: Symbol("Friend"),
  ENEMY: Symbol("Enemy"),
};
const Approachability = {
  REJECT: { canLand: false, canGoOver: false },
  END: { canLand: true, canGoOver: false },
  ONLY_PASS: { canLand: false, canGoOver: true },
  CONTINUE: { canLand: true, canGoOver: true },
};
const TInteraction = {
  NORMAL: new Map([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.END],
    [Relation.TO_BLANK, Approachability.CONTINUE],
  ]),
  NO_CAPTURE: new Map([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.REJECT],
    [Relation.TO_BLANK, Approachability.CONTINUE],
  ]),
  ONLY_CAPTURE: new Map([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.END],
    [Relation.TO_BLANK, Approachability.ONLY_PASS],
  ]),
};
class IMove {
  add(move) {
    if (move instanceof MoveParallelJoint) {
      return new MoveParallelJoint(this, ...move.move);
    }
    return new MoveParallelJoint(this, move);
  }
}
class LeaperMove extends IMove {
  constructor(coordinates, symmetry = "none", interaction) {
    super();
    _LeaperMove_coordinates.set(this, void 0);
    this.interaction = interaction ?? TInteraction.NORMAL;
    __classPrivateFieldSet(
      this,
      _LeaperMove_coordinates,
      new Set(coordinates),
      "f"
    );
    switch (symmetry) {
      case "oct":
        for (const coord of [
          ...__classPrivateFieldGet(this, _LeaperMove_coordinates, "f"),
        ]) {
          __classPrivateFieldGet(this, _LeaperMove_coordinates, "f").add(
            coord.upsideLeft
          );
        }
      case "fblr":
        for (const coord of [
          ...__classPrivateFieldGet(this, _LeaperMove_coordinates, "f"),
        ]) {
          __classPrivateFieldGet(this, _LeaperMove_coordinates, "f").add(
            coord.yInverted
          );
        }
      case "lr":
        for (const coord of [
          ...__classPrivateFieldGet(this, _LeaperMove_coordinates, "f"),
        ]) {
          __classPrivateFieldGet(this, _LeaperMove_coordinates, "f").add(
            coord.xInverted
          );
        }
      case "none":
    }
  }
  derive(coordinates, symmetry = "none", interaction) {
    return new this.constructor(
      coordinates ?? __classPrivateFieldGet(this, _LeaperMove_coordinates, "f"),
      symmetry,
      interaction ?? this.interaction
    );
  }
  coordinatesInController(controller) {
    return controller === PlayerIndex.WHITE
      ? __classPrivateFieldGet(this, _LeaperMove_coordinates, "f")
      : new Set(
          [...__classPrivateFieldGet(this, _LeaperMove_coordinates, "f")].map(
            (value) => value.fullInverted
          )
        );
  }
  validDestination(board, controller, currentCoordinate) {
    const destinations = new Set();
    for (const movement of this.coordinatesInController(controller)) {
      const newCoordinate = currentCoordinate.add(movement);
      if (!newCoordinate.isInside(board)) {
        continue;
      }
      const targetSquare = board.square(newCoordinate);
      if (targetSquare.isExcluded) {
        continue;
      }
      const relation = PlayerIndex.relation(
        controller,
        targetSquare.piece?.controller
      );
      if (this.interaction.get(relation).canLand) {
        destinations.add(newCoordinate);
      }
    }
    return destinations;
  }
}
_LeaperMove_coordinates = new WeakMap();
class RiderMove extends IMove {
  constructor(coordinatesToDist, symmetry = "none", interaction) {
    super();
    _RiderMove_coordinatesToDist.set(this, void 0);
    this.interaction = interaction ?? TInteraction.NORMAL;
    const adoptDist = (dist1, dist2) =>
      dist1 < 0 || dist2 < 0 ? -1 : Math.max(dist1, dist2);
    __classPrivateFieldSet(
      this,
      _RiderMove_coordinatesToDist,
      new DefaultDict(() => 0, coordinatesToDist),
      "f"
    );
    switch (symmetry) {
      case "oct":
        for (const [coord, dist] of [
          ...__classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f"),
        ]) {
          __classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f").set(
            coord.upsideLeft,
            adoptDist(
              __classPrivateFieldGet(
                this,
                _RiderMove_coordinatesToDist,
                "f"
              ).get(coord.upsideLeft),
              dist
            )
          );
        }
      case "fblr":
        for (const [coord, dist] of [
          ...__classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f"),
        ]) {
          __classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f").set(
            coord.yInverted,
            adoptDist(
              __classPrivateFieldGet(
                this,
                _RiderMove_coordinatesToDist,
                "f"
              ).get(coord.yInverted),
              dist
            )
          );
        }
      case "lr":
        for (const [coord, dist] of [
          ...__classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f"),
        ]) {
          __classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f").set(
            coord.xInverted,
            adoptDist(
              __classPrivateFieldGet(
                this,
                _RiderMove_coordinatesToDist,
                "f"
              ).get(coord.xInverted),
              dist
            )
          );
        }
      case "none":
    }
  }
  derive(coordinatesToDist, symmetry = "none", interaction) {
    return new this.constructor(
      coordinatesToDist ??
        __classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f"),
      symmetry,
      interaction ?? this.interaction
    );
  }
  coordinatesInController(controller) {
    return controller === PlayerIndex.WHITE
      ? __classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f")
      : new Map(
          [
            ...__classPrivateFieldGet(this, _RiderMove_coordinatesToDist, "f"),
          ].map(([coord, dist]) => [coord.fullInverted, dist])
        );
  }
  validDestination(board, controller, currentCoordinate) {
    const destinations = new Set();
    for (let [movement, maxDist] of this.coordinatesInController(controller)) {
      if (maxDist < 0) {
        maxDist = Math.max(board.height, board.width);
      }
      for (
        let moveNum = 1, newCoordinate = currentCoordinate.add(movement);
        moveNum <= maxDist;
        ++moveNum, newCoordinate = newCoordinate.add(movement)
      ) {
        if (!newCoordinate.isInside(board)) {
          break;
        }
        const targetSquare = board.square(newCoordinate);
        if (targetSquare.isExcluded) {
          break;
        }
        const relation = PlayerIndex.relation(
          controller,
          targetSquare.piece?.controller
        );
        if (this.interaction.get(relation).canLand) {
          destinations.add(newCoordinate);
        }
        if (!this.interaction.get(relation).canGoOver) {
          break;
        }
      }
    }
    return destinations;
  }
}
_RiderMove_coordinatesToDist = new WeakMap();
class MoveParallelJoint extends IMove {
  constructor(...move) {
    super();
    this.move = move;
  }
  add(move) {
    if (move instanceof MoveParallelJoint) {
      return new MoveParallelJoint(...this.move, ...move.move);
    }
    return new MoveParallelJoint(...this.move, move);
  }
  validDestination(board, controller, currentCoordinate) {
    const coords = new Set();
    for (const moveElement of this.move) {
      for (const coord of moveElement.validDestination(
        board,
        controller,
        currentCoordinate
      )) {
        coords.add(coord);
      }
    }
    return coords;
  }
}
const PROMOTE_DEFAULT_REAL = new Map();
class IPiece {
  constructor(controller, isUntouched = false) {
    this.controller = controller;
    this.isUntouched = isUntouched;
    this.IS_ROYAL = false;
    this.FORCE_PROMOTE = false;
    this.ORIGINAL_PIECE = this.constructor;
    const original = this.constructor;
    if (!PROMOTE_DEFAULT_REAL.has(original)) {
      const truePromotedPieces = new Set();
      for (const [piece, name, symbol] of this.PROMOTE_DEFAULT) {
        class _ extends piece {
          constructor() {
            super(...arguments);
            this.ORIGINAL_PIECE = original;
          }
          get NAME() {
            return name ?? `${super.NAME} as promotion of ${super.NAME}`;
          }
          get SYMBOL() {
            return symbol ?? super.SYMBOL;
          }
          get PROMOTE_DEFAULT() {
            return new Set();
          }
        }
        truePromotedPieces.add(_);
      }
      PROMOTE_DEFAULT_REAL.set(original, truePromotedPieces);
    }
    this.PROMOTE_DEFAULT_TRUE = PROMOTE_DEFAULT_REAL.get(original);
  }
  get INITIAL_MOVE() {
    return this.MOVE;
  }
  get PROMOTE_DEFAULT() {
    return new Set();
  }
  get IS_PROMOTED() {
    return this.ORIGINAL_PIECE !== this.constructor;
  }
  static toString() {
    return new this(undefined).SYMBOL;
  }
  validDestination(board, myCoordinate) {
    if (!this.controller) {
      throw new Error("no support for dummy piece");
    }
    const referentMove = this.isUntouched ? this.INITIAL_MOVE : this.MOVE;
    return referentMove.validDestination(board, this.controller, myCoordinate);
  }
}
class Square {
  constructor(piece = null, isExcluded = false) {
    this.piece = piece;
    this.isExcluded = isExcluded;
  }
}
class IBoard {
  balanceOf(coord, controller) {
    return controller === PlayerIndex.WHITE
      ? [coord.normalizedBy(this, false), coord.normalizedBy(this, true)]
      : [
          coord.fullInverted.normalizedBy(this, false),
          coord.fullInverted.normalizedBy(this, true),
        ];
  }
  squareRefererToString(coord) {
    return `${String.fromCharCode(97 + coord.x)}${coord.y + 1}`;
  }
  square(coord) {
    return this.board[coord.y][coord.x];
  }
}
const TPromotionCondition = {
  oppornentField(
    row,
    allowInside = true,
    allowEscape = true,
    allowEnter = true,
    allowOutside = false
  ) {
    return (log) => {
      if (!log.start) {
        return false;
      }
      const isBeforeIn =
        row >= -log.board.balanceOf(log.start, log.turnPlayer)[1].y;
      const isAfterIn =
        row >= -log.board.balanceOf(log.goal, log.turnPlayer)[1].y;
      return isAfterIn
        ? isBeforeIn
          ? allowInside
          : allowEnter
        : isBeforeIn
        ? allowEscape
        : allowOutside;
    };
  },
  capturedPiece: () => (log) => Boolean(log.capturedPiece),
};
class MatchBoard extends IBoard {
  constructor(
    IO,
    height,
    width,
    initialPosition,
    excludedSquare = [],
    canUseCapturedPiece = false,
    promotionCondition,
    lrSymmetry = false,
    wbSymmetry = "none"
  ) {
    super();
    this.IO = IO;
    this.height = height;
    this.width = width;
    this.canUseCapturedPiece = canUseCapturedPiece;
    _MatchBoard_instances.add(this);
    _MatchBoard_movablePieceMapCache.set(this, void 0);
    this.playLog = [];
    this.chessTurnCount = 0;
    this.turnPlayer = PlayerIndex.WHITE;
    this.promotionCondition =
      promotionCondition ??
      TPromotionCondition.oppornentField(Math.floor(this.height / 3));
    this.board = [...Array(this.height)].map(() =>
      [...Array(this.width)].map(() => new Square())
    );
    this.pieceStands = new Map([
      [PlayerIndex.WHITE, new Counter()],
      [PlayerIndex.BLACK, new Counter()],
    ]);
    this.pieceInBoardIndex = new Map([
      [PlayerIndex.WHITE, new DefaultDict(() => new Set())],
      [PlayerIndex.BLACK, new DefaultDict(() => new Set())],
    ]);
    // TODO: 内部的に同じオブジェクトを指しているらしい
    const excludedSquareSet = new Set(
      [...excludedSquare].map((position) => position.normalizedBy(this))
    );
    if (lrSymmetry) {
      const initialPositionxInverted = new Map(
        [...initialPosition].map(([position, piece]) => [
          position.xInverted.normalizedBy(this),
          piece,
        ])
      );
      initialPosition = new Map([
        ...initialPositionxInverted,
        ...initialPosition,
      ]);
    }
    if (wbSymmetry !== "none") {
      let accessor;
      switch (wbSymmetry) {
        case "face":
          accessor = "yInverted";
          break;
        case "cross":
          accessor = "fullInverted";
          break;
      }
      const initialPositionAddition = new Map(
        [...initialPosition].map(([position, piece]) => [
          position[accessor].normalizedBy(this),
          new piece.constructor(
            PlayerIndex.nextPlayer(piece.controller),
            piece.isUntouched
          ),
        ])
      );
      initialPosition = new Map([
        ...initialPositionAddition,
        ...initialPosition,
      ]);
    }
    for (const coord of excludedSquareSet) {
      this.square(coord).isExcluded = true;
    }
    for (const [position, piece] of initialPosition) {
      console.log(position, piece);
      __classPrivateFieldGet(
        this,
        _MatchBoard_instances,
        "m",
        _MatchBoard_addPieceToBoard
      ).call(this, piece.constructor, piece.controller, position, true, "skip");
    }
    __classPrivateFieldSet(
      this,
      _MatchBoard_movablePieceMapCache,
      new Map(),
      "f"
    );
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_updateMovablePieceMap
    ).call(this);
  }
  async game() {
    const converter = (r) =>
      r instanceof Array
        ? __classPrivateFieldGet(
            this,
            _MatchBoard_instances,
            "m",
            _MatchBoard_numToCoord
          ).call(this, ...r)
        : r;
    const playerToNum = (p) => (p === PlayerIndex.WHITE ? 0 : 1);
    this.IO.initializeBoardVisualization();
    for (const coord of __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "a",
      _MatchBoard_coordsGenerator_get
    )) {
      const piece = this.square(coord).piece;
      this.IO.renderCell(
        ...__classPrivateFieldGet(
          this,
          _MatchBoard_instances,
          "m",
          _MatchBoard_coordToNum
        ).call(this, coord),
        playerToNum(piece?.controller),
        piece?.SYMBOL ?? "",
        Boolean(piece?.IS_PROMOTED)
      );
    }
    // ゲーム終了までループ
    while (
      !__classPrivateFieldGet(
        this,
        _MatchBoard_instances,
        "a",
        _MatchBoard_isGameTerminated_get
      )[0]
    ) {
      const playLog = {
        state: "defined",
        board: this,
        totalStepCount: this.playLog.length,
        chessTurnCount: this.chessTurnCount,
        turnPlayer: this.turnPlayer,
      };
      __classPrivateFieldGet(
        this,
        _MatchBoard_instances,
        "m",
        _MatchBoard_updateMovablePieceMap
      ).call(this);
      this.IO.startTurnMessaging(playerToNum(this.turnPlayer));
      Turn: while (true) {
        const target = converter(
          await this.IO.selectBoard(
            [
              [
                ...__classPrivateFieldGet(
                  this,
                  _MatchBoard_movablePieceMapCache,
                  "f"
                ).keys(),
              ].map(
                __classPrivateFieldGet(
                  this,
                  _MatchBoard_instances,
                  "m",
                  _MatchBoard_coordToNum
                ).bind(this)
              ),
              [...this.pieceStands.get(this.turnPlayer).keys()],
              this.turnPlayer,
            ],
            "移動させる駒か打つ駒を選んでください。",
            false
          )
        );
        if (target === null) {
          this.IO.showWinner(
            playerToNum(PlayerIndex.nextPlayer(this.turnPlayer))
          );
          return;
        }
        if (target instanceof AbsoluteCoordinate) {
          // コマを動かす
          const goal = converter(
            await this.IO.selectBoard(
              [
                [
                  ...__classPrivateFieldGet(
                    this,
                    _MatchBoard_instances,
                    "a",
                    _MatchBoard_currentMovablePieceMap_get
                  ).get(target),
                ].map(
                  __classPrivateFieldGet(
                    this,
                    _MatchBoard_instances,
                    "m",
                    _MatchBoard_coordToNum
                  ).bind(this)
                ),
              ],
              "駒を移動させるマスを選んでください。",
              true
            )
          );
          if (goal === null) {
            continue Turn;
          }
          __classPrivateFieldGet(
            this,
            _MatchBoard_instances,
            "m",
            _MatchBoard_move
          ).call(this, target, goal, playLog);
          let isPromoted = false;
          if (this.promotionCondition(playLog)) {
            const movingPiece = this.square(goal).piece;
            const promoteTo = await this.IO.selectPromotion(
              [
                ...movingPiece.PROMOTE_DEFAULT_TRUE,
                ...(movingPiece.FORCE_PROMOTE ? [] : [playLog.movingPiece]),
              ],
              "どの駒に成るかを選んでください"
            );
            if (promoteTo !== playLog.movingPiece) {
              __classPrivateFieldGet(
                this,
                _MatchBoard_instances,
                "m",
                _MatchBoard_promote
              ).call(this, promoteTo, goal, playLog);
              isPromoted = true;
            }
          }
          this.IO.renderCell(
            ...__classPrivateFieldGet(
              this,
              _MatchBoard_instances,
              "m",
              _MatchBoard_coordToNum
            ).call(this, goal),
            playerToNum(this.turnPlayer),
            this.square(goal).piece?.SYMBOL ?? "",
            isPromoted
          );
          this.IO.renderCell(
            ...__classPrivateFieldGet(
              this,
              _MatchBoard_instances,
              "m",
              _MatchBoard_coordToNum
            ).call(this, target),
            playerToNum(this.turnPlayer),
            this.square(target).piece?.SYMBOL ?? "",
            false
          );
          this.IO.renderCapturedPiece(
            playerToNum(this.turnPlayer),
            [...this.pieceStands.get(this.turnPlayer).entries()].map(
              ([kind, num]) => ({
                name: new kind(undefined).SYMBOL,
                count: num,
              })
            )
          );
          break Turn;
        } else {
          // コマを打つ
          const goal = converter(
            await this.IO.selectBoard(
              [
                [
                  ...__classPrivateFieldGet(
                    this,
                    _MatchBoard_instances,
                    "m",
                    _MatchBoard_dropDestination
                  ).call(this),
                ].map(
                  __classPrivateFieldGet(
                    this,
                    _MatchBoard_instances,
                    "m",
                    _MatchBoard_coordToNum
                  ).bind(this)
                ),
              ],
              "駒を置くマスを選んでください。",
              true
            )
          );
          if (goal === null) {
            continue Turn;
          }
          __classPrivateFieldGet(
            this,
            _MatchBoard_instances,
            "m",
            _MatchBoard_drop
          ).call(this, target, goal, playLog);
          this.IO.renderCell(
            ...__classPrivateFieldGet(
              this,
              _MatchBoard_instances,
              "m",
              _MatchBoard_coordToNum
            ).call(this, goal),
            playerToNum(this.turnPlayer),
            new target(undefined).SYMBOL,
            false
          );
          this.IO.renderCapturedPiece(
            playerToNum(this.turnPlayer),
            [...this.pieceStands.get(this.turnPlayer).entries()].map(
              ([kind, num]) => ({
                name: new kind(undefined).SYMBOL,
                count: num,
              })
            )
          );
          break Turn;
        }
      }
      this.turnPlayer = PlayerIndex.nextPlayer(this.turnPlayer);
      if (this.turnPlayer === PlayerIndex.WHITE) {
        this.chessTurnCount += 1;
      }
    }
    this.IO.showWinner(
      playerToNum(
        __classPrivateFieldGet(
          this,
          _MatchBoard_instances,
          "a",
          _MatchBoard_isGameTerminated_get
        )[1]
      )
    );
    return;
  }
}
(_MatchBoard_movablePieceMapCache = new WeakMap()),
  (_MatchBoard_instances = new WeakSet()),
  (_MatchBoard_coordsGenerator_get =
    function _MatchBoard_coordsGenerator_get() {
      const self = this;
      return (function* () {
        for (let h = 0; h < self.height; h++) {
          for (let w = 0; w < self.width; w++) {
            yield new AbsoluteCoordinate(h, w);
          }
        }
      })();
    }),
  (_MatchBoard_isGameTerminated_get =
    function _MatchBoard_isGameTerminated_get() {
      const remainingPlayer = new Set();
      for (const player of [PlayerIndex.WHITE, PlayerIndex.BLACK]) {
        for (const [kind, coords] of this.pieceInBoardIndex.get(player)) {
          if (new kind(undefined).IS_ROYAL && coords.size > 0) {
            remainingPlayer.add(player);
            break;
          }
        }
      }
      switch (remainingPlayer.size) {
        case 0:
          return [true, undefined];
        case 1:
          return [true, [...remainingPlayer][0]];
        default:
          return [false, undefined];
      }
    }),
  (_MatchBoard_addPieceToStand = function _MatchBoard_addPieceToStand(
    kind,
    controller
  ) {
    this.pieceStands.get(controller).apply(kind, (value) => value + 1);
  }),
  (_MatchBoard_addPieceToBoard = function _MatchBoard_addPieceToBoard(
    kind,
    controller,
    coord,
    asUntouched = false,
    collision = "raise"
  ) {
    if (this.square(coord).isExcluded) {
      switch (collision) {
        case "raise":
        case "overwrite":
          throw new Error("cannot set a piece to excluded square");
        case "skip":
          return;
      }
    }
    if (this.square(coord).piece) {
      switch (collision) {
        case "raise":
          throw new Error(`piece is already in ${coord}`);
        case "skip":
          return;
        case "overwrite":
      }
    }
    this.square(coord).piece = new kind(controller, asUntouched);
    if (!this.pieceInBoardIndex.get(controller).has(kind)) {
      this.pieceInBoardIndex.get(controller).set(kind, new Set());
    }
    this.pieceInBoardIndex.get(controller).get(kind).add(coord);
  }),
  (_MatchBoard_removePieceFromStand = function _MatchBoard_removePieceFromStand(
    kind,
    controller
  ) {
    const activePieceStand = this.pieceStands.get(controller);
    switch (activePieceStand.get(kind)) {
      case 0:
        throw new Error(`${kind} is not in piece stand`);
      case 1:
        activePieceStand.delete(kind);
        break;
      default:
        activePieceStand.apply(kind, (value) => value - 1);
    }
  }),
  (_MatchBoard_removePieceFromBoard = function _MatchBoard_removePieceFromBoard(
    coord
  ) {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`removing null piece (from ${coord})`);
    }
    this.square(coord).piece = null;
    this.pieceInBoardIndex
      .get(piece.controller)
      .get(piece.constructor)
      .delete(coord);
  }),
  (_MatchBoard_moveDestinationFrom = function _MatchBoard_moveDestinationFrom(
    coord
  ) {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`cannot move null (in ${coord})`);
    }
    return piece.validDestination(this, coord);
  }),
  (_MatchBoard_dropDestination = function _MatchBoard_dropDestination() {
    const destinations = new Set();
    for (const coord of __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "a",
      _MatchBoard_coordsGenerator_get
    )) {
      const square = this.square(coord);
      if (!(square.isExcluded || square.piece)) {
        destinations.add(coord);
      }
    }
    return destinations;
  }),
  (_MatchBoard_updateMovablePieceMap =
    function _MatchBoard_updateMovablePieceMap() {
      const turnPlayerPieceToValidDestination = new Map();
      for (const coords of this.pieceInBoardIndex
        .get(this.turnPlayer)
        .values()) {
        for (const start of coords) {
          const goal = __classPrivateFieldGet(
            this,
            _MatchBoard_instances,
            "m",
            _MatchBoard_moveDestinationFrom
          ).call(this, start);
          if (goal.size) {
            turnPlayerPieceToValidDestination.set(start, goal);
          }
        }
      }
      __classPrivateFieldSet(
        this,
        _MatchBoard_movablePieceMapCache,
        turnPlayerPieceToValidDestination,
        "f"
      );
    }),
  (_MatchBoard_currentMovablePieceMap_get =
    function _MatchBoard_currentMovablePieceMap_get() {
      return __classPrivateFieldGet(
        this,
        _MatchBoard_movablePieceMapCache,
        "f"
      );
    }),
  (_MatchBoard_move = function _MatchBoard_move(start, goal, log) {
    const movingPiece = this.square(start).piece;
    if (!movingPiece) {
      throw new Error(`cannot move null (in ${start})`);
    }
    const capturedPiece = this.square(goal).piece;
    if (capturedPiece) {
      __classPrivateFieldGet(
        this,
        _MatchBoard_instances,
        "m",
        _MatchBoard_addPieceToStand
      ).call(this, capturedPiece.ORIGINAL_PIECE, movingPiece.controller);
      __classPrivateFieldGet(
        this,
        _MatchBoard_instances,
        "m",
        _MatchBoard_removePieceFromBoard
      ).call(this, goal);
    }
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_removePieceFromBoard
    ).call(this, start);
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_addPieceToBoard
    ).call(this, movingPiece.constructor, movingPiece.controller, goal);
    log.state = "complete";
    log.start = start;
    log.goal = goal;
    log.movingPiece = movingPiece.constructor;
    log.capturedPiece = capturedPiece?.constructor;
  }),
  (_MatchBoard_drop = function _MatchBoard_drop(kind, coord, log) {
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_addPieceToBoard
    ).call(this, kind, this.turnPlayer, coord);
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_removePieceFromStand
    ).call(this, kind, this.turnPlayer);
    log.state = "complete";
    log.goal = coord;
    log.movingPiece = kind;
  }),
  (_MatchBoard_promote = function _MatchBoard_promote(kind, coord, log) {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`removing null piece (from ${coord})`);
    }
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_removePieceFromBoard
    ).call(this, coord);
    __classPrivateFieldGet(
      this,
      _MatchBoard_instances,
      "m",
      _MatchBoard_addPieceToBoard
    ).call(this, kind, piece.controller, coord);
    log.promoteTo = kind;
  }),
  (_MatchBoard_coordToNum = function _MatchBoard_coordToNum(coord) {
    return [this.height - coord.y - 1, coord.x];
  }),
  (_MatchBoard_numToCoord = function _MatchBoard_numToCoord(y, x) {
    return new AbsoluteCoordinate(this.height - y - 1, x);
  });
const players = {
  0: PlayerIndex.WHITE,
  1: PlayerIndex.BLACK,
};
const Cell = AbsoluteCoordinate;
const Vector = RelativeCoordinate;
//# sourceMappingURL=customshogi.js.map
