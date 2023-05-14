class DefaultDict<K, V> extends Map<K, V> {
  constructor(
    public defaultFactory: () => V,
    iterable?: Iterable<readonly [K, V]> | null
  ) {
    super(iterable);
  }

  override get(key: K): V {
    const value = super.get(key);
    return value === undefined ? this.defaultFactory() : value;
  }

  apply(key: K, callbackfn: (value: V) => V): this {
    return this.set(key, callbackfn(this.get(key)));
  }
}

class Counter<K> extends DefaultDict<K, number> {
  constructor(iterable?: Iterable<readonly [K, number]> | null) {
    super(() => 0, iterable);
  }
}

const coordCatalog = new Map<string, Coordinate>();
class Coordinate {
  constructor(public readonly y: number, public readonly x: number) {
    const key: string = `${this.constructor.name}(${y === -0 ? 0 : y}, ${
      x === -0 ? 0 : x
    })`;
    if (coordCatalog.has(key)) {
      return coordCatalog.get(key)!;
    }
    coordCatalog.set(key, this);
  }

  toString(): string {
    return `${this.constructor.name}${(this.y, this.x)}`;
  }

  add<T extends Coordinate>(coord: Coordinate): T {
    return new (this.constructor as { new (y: number, x: number): T })(
      this.y + coord.y,
      this.x + coord.x
    );
  }

  eq(coord: Coordinate): boolean {
    return this.y === coord.y && this.x === coord.x;
  }
}

class AbsoluteCoordinate extends Coordinate {
  get xInverted() {
    return new AbsoluteCoordinate(this.y, -this.x - 1);
  }

  get yInverted() {
    return new AbsoluteCoordinate(-this.y - 1, this.x);
  }

  get fullInverted() {
    return new AbsoluteCoordinate(-this.y - 1, -this.x - 1);
  }

  isInside(board: IBoard, strict: boolean = true): boolean {
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

  normalizedBy(board: IBoard, negative: boolean = false): AbsoluteCoordinate {
    if (!this.isInside(board, false)) {
      throw RangeError(
        `${this.toString()} is out of the board ${(board.height, board.width)}`
      );
    }
    return new AbsoluteCoordinate(
      this.#normalizer(this.y, board.height, negative),
      this.#normalizer(this.x, board.width, negative)
    );
  }

  #normalizer(
    target: number,
    standard: number,
    negative: boolean = false
  ): number {
    if (negative) {
      if (target >= 0) {
        return target - standard;
      }
    } else if (target < 0) {
      return target + standard;
    }
    return target;
  }
}

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
  static readonly WHITE = Symbol("White");
  static readonly BLACK = Symbol("Black");

  static relation(self: Player, value?: Player): RelationType {
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

  static nextPlayer(self: Player): Player {
    if (self === PlayerIndex.WHITE) {
      return PlayerIndex.BLACK;
    }
    if (self === PlayerIndex.BLACK) {
      return PlayerIndex.WHITE;
    }
    throw new Error("next turn of absent");
  }
}
type Player = typeof PlayerIndex.WHITE | typeof PlayerIndex.BLACK;

const Relation = {
  TO_BLANK: Symbol("To blank"),
  FRIEND: Symbol("Friend"),
  ENEMY: Symbol("Enemy"),
} as const;
type RelationType = (typeof Relation)[keyof typeof Relation];

const Approachability = {
  REJECT: { canLand: false, canGoOver: false },
  END: { canLand: true, canGoOver: false },
  ONLY_PASS: { canLand: false, canGoOver: true },
  CONTINUE: { canLand: true, canGoOver: true },
} as const;
type ApproachabilityType = { canLand: boolean; canGoOver: boolean };

const TInteraction = {
  NORMAL: new Map<RelationType, ApproachabilityType>([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.END],
    [Relation.TO_BLANK, Approachability.CONTINUE],
  ]),
  NO_CAPTURE: new Map<RelationType, ApproachabilityType>([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.REJECT],
    [Relation.TO_BLANK, Approachability.CONTINUE],
  ]),
  ONLY_CAPTURE: new Map<RelationType, ApproachabilityType>([
    [Relation.FRIEND, Approachability.REJECT],
    [Relation.ENEMY, Approachability.END],
    [Relation.TO_BLANK, Approachability.ONLY_PASS],
  ]),
} as const;
type Interaction = Map<RelationType, ApproachabilityType>;

abstract class IMove {
  add(move: IMove): MoveParallelJoint {
    if (move instanceof MoveParallelJoint) {
      return new MoveParallelJoint(this, ...move.move);
    }
    return new MoveParallelJoint(this, move);
  }

  abstract validDestination(
    board: IBoard,
    controller: Player,
    currentCoordinate: AbsoluteCoordinate
  ): Set<AbsoluteCoordinate>;
}

class LeaperMove extends IMove {
  interaction: Map<symbol, ApproachabilityType>;
  #coordinates: Set<RelativeCoordinate>;

  constructor(
    coordinates: Iterable<RelativeCoordinate>,
    symmetry: "none" | "lr" | "fblr" | "oct" = "none",
    interaction?: Interaction
  ) {
    super();

    this.interaction = interaction ?? TInteraction.NORMAL;

    this.#coordinates = new Set(coordinates);
    switch (symmetry) {
      case "oct":
        for (const coord of [...this.#coordinates]) {
          this.#coordinates.add(coord.upsideLeft);
        }
      case "fblr":
        for (const coord of [...this.#coordinates]) {
          this.#coordinates.add(coord.yInverted);
        }
      case "lr":
        for (const coord of [...this.#coordinates]) {
          this.#coordinates.add(coord.xInverted);
        }
      case "none":
    }
  }

  derive(
    coordinates: Iterable<RelativeCoordinate>,
    symmetry: "none" | "lr" | "fblr" | "oct" = "none",
    interaction?: Interaction
  ) {
    return new (this.constructor as {
      new (
        coordinates: Iterable<RelativeCoordinate>,
        symmetry?: "none" | "lr" | "fblr" | "oct",
        interaction?: Interaction
      ): LeaperMove;
    })(
      coordinates ?? this.#coordinates,
      symmetry,
      interaction ?? this.interaction
    );
  }

  coordinatesInController(controller: Player): Set<RelativeCoordinate> {
    return controller === PlayerIndex.WHITE
      ? this.#coordinates
      : new Set(
          [...this.#coordinates].map(
            (value: RelativeCoordinate) => value.fullInverted
          )
        );
  }

  validDestination(
    board: IBoard,
    controller: Player,
    currentCoordinate: AbsoluteCoordinate
  ): Set<AbsoluteCoordinate> {
    const destinations = new Set<AbsoluteCoordinate>();
    for (const movement of this.coordinatesInController(controller)) {
      const newCoordinate: AbsoluteCoordinate =
        currentCoordinate.add<AbsoluteCoordinate>(movement);
      if (!newCoordinate.isInside(board)) {
        continue;
      }
      const targetSquare = board.square(newCoordinate);
      if (targetSquare.isExcluded) {
        continue;
      }
      const relation: RelationType = PlayerIndex.relation(
        controller,
        targetSquare.piece?.controller
      );
      if (this.interaction.get(relation)!.canLand) {
        destinations.add(newCoordinate);
      }
    }
    return destinations;
  }
}

class RiderMove extends IMove {
  interaction: Map<symbol, ApproachabilityType>;
  #coordinatesToDist: Map<RelativeCoordinate, number>;

  constructor(
    coordinatesToDist: Map<RelativeCoordinate, number>,
    symmetry: "none" | "lr" | "fblr" | "oct" = "none",
    interaction?: Interaction
  ) {
    super();

    this.interaction = interaction ?? TInteraction.NORMAL;

    const adoptDist = (dist1: number, dist2: number) =>
      dist1 < 0 || dist2 < 0 ? -1 : Math.max(dist1, dist2);
    this.#coordinatesToDist = new DefaultDict(() => 0, coordinatesToDist);
    switch (symmetry) {
      case "oct":
        for (const [coord, dist] of [...this.#coordinatesToDist]) {
          this.#coordinatesToDist.set(
            coord.upsideLeft,
            adoptDist(this.#coordinatesToDist.get(coord.upsideLeft)!, dist)
          );
        }
      case "fblr":
        for (const [coord, dist] of [...this.#coordinatesToDist]) {
          this.#coordinatesToDist.set(
            coord.yInverted,
            adoptDist(this.#coordinatesToDist.get(coord.yInverted)!, dist)
          );
        }
      case "lr":
        for (const [coord, dist] of [...this.#coordinatesToDist]) {
          this.#coordinatesToDist.set(
            coord.xInverted,
            adoptDist(this.#coordinatesToDist.get(coord.xInverted)!, dist)
          );
        }
      case "none":
    }
  }

  derive(
    coordinatesToDist: Map<RelativeCoordinate, number>,
    symmetry: "none" | "lr" | "fblr" | "oct" = "none",
    interaction?: Interaction
  ) {
    return new (this.constructor as {
      new (
        coordinatesToDist: Map<RelativeCoordinate, number>,
        symmetry?: "none" | "lr" | "fblr" | "oct",
        interaction?: Interaction
      ): RiderMove;
    })(
      coordinatesToDist ?? this.#coordinatesToDist,
      symmetry,
      interaction ?? this.interaction
    );
  }

  coordinatesInController(controller: Player): Map<RelativeCoordinate, number> {
    return controller === PlayerIndex.WHITE
      ? this.#coordinatesToDist
      : new Map(
          [...this.#coordinatesToDist].map(([coord, dist]) => [
            coord.fullInverted,
            dist,
          ])
        );
  }

  validDestination(
    board: IBoard,
    controller: Player,
    currentCoordinate: AbsoluteCoordinate
  ): Set<AbsoluteCoordinate> {
    const destinations = new Set<AbsoluteCoordinate>();
    for (let [movement, maxDist] of this.coordinatesInController(controller)) {
      if (maxDist < 0) {
        maxDist = Math.max(board.height, board.width);
      }
      for (
        let moveNum = 1,
          newCoordinate = currentCoordinate.add<AbsoluteCoordinate>(movement);
        moveNum <= maxDist;
        ++moveNum, newCoordinate = newCoordinate.add(movement)
      ) {
        if (!newCoordinate.isInside(board)) {
          break;
        }
        const targetSquare = board.square(newCoordinate);
        if (targetSquare.isExcluded) {
          continue;
        }
        const relation: RelationType = PlayerIndex.relation(
          controller,
          targetSquare.piece?.controller
        );
        if (this.interaction.get(relation)!.canLand) {
          destinations.add(newCoordinate);
        }
        if (!this.interaction.get(relation)!.canGoOver) {
          break;
        }
      }
    }
    return destinations;
  }
}

class MoveParallelJoint extends IMove {
  move: IMove[];

  constructor(...move: IMove[]) {
    super();
    this.move = move;
  }

  add(move: IMove): MoveParallelJoint {
    if (move instanceof MoveParallelJoint) {
      return new MoveParallelJoint(...this.move, ...move.move);
    }
    return new MoveParallelJoint(...this.move, move);
  }

  validDestination(
    board: IBoard,
    controller: Player,
    currentCoordinate: AbsoluteCoordinate
  ): Set<AbsoluteCoordinate> {
    const coords: Set<AbsoluteCoordinate> = new Set();
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

const PROMOTE_DEFAULT_REAL = new Map<PieceType, Set<PieceType>>();
abstract class IPiece {
  readonly PROMOTE_DEFAULT_TRUE: Set<PieceType>;
  constructor(public controller?: Player, public isUntouched: boolean = false) {
    const original = this.constructor as PieceType;
    if (!PROMOTE_DEFAULT_REAL.has(original)) {
      const truePromotedPieces = new Set<PieceType>();

      for (const [piece, name, symbol] of this.PROMOTE_DEFAULT) {
        class _ extends piece {
          get NAME() {
            return name ?? `${super.NAME} as promotion of ${super.NAME}`;
          }
          get SYMBOL() {
            return symbol ?? super.SYMBOL;
          }
          get PROMOTE_DEFAULT() {
            return new Set<[PieceType, string?, string?]>();
          }
          ORIGINAL_PIECE = original;
        }
        truePromotedPieces.add(_);
      }
      PROMOTE_DEFAULT_REAL.set(original, truePromotedPieces);
    }
    this.PROMOTE_DEFAULT_TRUE = PROMOTE_DEFAULT_REAL.get(original)!;
  }

  abstract get NAME(): string;
  abstract get MOVE(): IMove;
  get INITIAL_MOVE(): IMove {
    return this.MOVE;
  }
  IS_ROYAL: boolean = false;
  abstract SYMBOL: string;
  get PROMOTE_DEFAULT(): Set<[PieceType, string?, string?]> {
    return new Set();
  }
  FORCE_PROMOTE: boolean = false;
  ORIGINAL_PIECE: PieceType = this.constructor as PieceType;
  get IS_PROMOTED(): boolean {
    return this.ORIGINAL_PIECE !== (this.constructor as PieceType);
  }

  static toString(): string {
    return new (this as PieceType)(undefined as any).SYMBOL;
  }

  validDestination(
    board: IBoard,
    myCoordinate: AbsoluteCoordinate
  ): Set<AbsoluteCoordinate> {
    if (!this.controller) {
      throw new Error("no support for dummy piece");
    }
    const referentMove: IMove = this.isUntouched
      ? this.INITIAL_MOVE
      : this.MOVE;
    return referentMove.validDestination(board, this.controller, myCoordinate);
  }
}
type PieceType = Pick<typeof IPiece, keyof typeof IPiece> &
  (new (controller: Player, isUntouched?: boolean) => RealPiece);
type RealPiece = Required<IPiece>;

class Square {
  constructor(
    public piece: RealPiece | null = null,
    public isExcluded: boolean = false
  ) {}
}

interface PlayLogBase {
  state: "defined";
  board: IBoard;
  totalStepCount: number;
  chessTurnCount: number;
  turnPlayer: Player;
}

interface PlayLogAddition {
  start?: AbsoluteCoordinate;
  goal: AbsoluteCoordinate;
  movingPiece: PieceType;
  capturedPiece?: PieceType;
  promoteTo?: PieceType;
}

interface PlayLogComplete extends Omit<PlayLogBase, "state">, PlayLogAddition {
  state: "complete";
}

type PlayLogUnit = PlayLogBase | PlayLogComplete;

abstract class IBoard {
  abstract height: number;
  abstract width: number;
  abstract board: Square[][];
  abstract pieceInBoardIndex: Map<
    Player,
    DefaultDict<PieceType, Set<AbsoluteCoordinate>>
  >;
  abstract pieceStands: Map<Player, Counter<PieceType>>;

  balanceOf(
    coord: AbsoluteCoordinate,
    controller: Player
  ): [AbsoluteCoordinate, AbsoluteCoordinate] {
    return controller === PlayerIndex.WHITE
      ? [coord.normalizedBy(this, false), coord.normalizedBy(this, true)]
      : [
          coord.fullInverted.normalizedBy(this, false),
          coord.fullInverted.normalizedBy(this, true),
        ];
  }

  squareRefererToString(coord: AbsoluteCoordinate): string {
    return `${String.fromCharCode(97 + coord.x)}${coord.y + 1}`;
  }

  square(coord: AbsoluteCoordinate): Square {
    return this.board[coord.y][coord.x];
  }
}

type PromotionCondition = (log: PlayLogComplete) => boolean;
const TPromotionCondition = {
  oppornentField(
    row: number,
    allowInside: boolean = true,
    allowEscape: boolean = true,
    allowEnter: boolean = true,
    allowOutside: boolean = false
  ) {
    return (log: PlayLogComplete) => {
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
  capturedPiece: () => (log: PlayLogComplete) => Boolean(log.capturedPiece),
} as const;

class MatchBoard extends IBoard {
  board: Square[][];
  playLog: PlayLogComplete[];
  chessTurnCount: number;
  turnPlayer: Player;
  readonly promotionCondition: (log: PlayLogComplete) => boolean;
  pieceStands: Map<Player, Counter<PieceType>>;
  pieceInBoardIndex: Map<
    Player,
    DefaultDict<PieceType, Set<AbsoluteCoordinate>>
  >;
  #movablePieceMapCache: Map<AbsoluteCoordinate, Set<AbsoluteCoordinate>>;

  constructor(
    public IO: IOFunctions,
    readonly height: number,
    readonly width: number,
    initialPosition: Map<AbsoluteCoordinate, RealPiece>,
    excludedSquare: Iterable<AbsoluteCoordinate> = [],
    readonly canUseCapturedPiece: boolean = false,
    promotionCondition?: (log: PlayLogComplete) => boolean,
    lrSymmetry: boolean = false,
    wbSymmetry: "none" | "face" | "cross" = "none"
  ) {
    super();

    this.playLog = [] as PlayLogComplete[];

    this.chessTurnCount = 0;
    this.turnPlayer = PlayerIndex.WHITE;

    this.promotionCondition =
      promotionCondition ??
      TPromotionCondition.oppornentField(Math.floor(this.height / 3));

    this.board = [...Array(this.height)].map(() =>
      [...Array(this.width)].map(() => new Square())
    );
    this.pieceStands = new Map<Player, Counter<PieceType>>([
      [PlayerIndex.WHITE, new Counter<PieceType>()],
      [PlayerIndex.BLACK, new Counter<PieceType>()],
    ]);
    this.pieceInBoardIndex = new Map<
      Player,
      DefaultDict<PieceType, Set<AbsoluteCoordinate>>
    >([
      [
        PlayerIndex.WHITE,
        new DefaultDict<PieceType, Set<AbsoluteCoordinate>>(() => new Set()),
      ],
      [
        PlayerIndex.BLACK,
        new DefaultDict<PieceType, Set<AbsoluteCoordinate>>(() => new Set()),
      ],
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
      let accessor: "yInverted" | "fullInverted";
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
          new (piece.constructor as PieceType)(
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
      this.#addPieceToBoard(
        piece.constructor as PieceType,
        piece.controller,
        position,
        true,
        "skip"
      );
    }
    this.#movablePieceMapCache = new Map();
    this.#updateMovablePieceMap();
  }

  get #coordsGenerator(): Generator<AbsoluteCoordinate, void> {
    const self = this;
    return (function* () {
      for (let h = 0; h < self.height; h++) {
        for (let w = 0; w < self.width; w++) {
          yield new AbsoluteCoordinate(h, w);
        }
      }
    })();
  }

  get #isGameTerminated(): [boolean, Player?] {
    const remainingPlayer = new Set<Player>();
    for (const player of [PlayerIndex.WHITE, PlayerIndex.BLACK] as Player[]) {
      for (const [kind, coords] of this.pieceInBoardIndex.get(player)!) {
        if (
          new kind(undefined as unknown as Player).IS_ROYAL &&
          coords.size > 0
        ) {
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
  }

  #addPieceToStand(kind: PieceType, controller: Player): void {
    this.pieceStands.get(controller)!.apply(kind, (value) => value + 1);
  }

  #addPieceToBoard(
    kind: PieceType,
    controller: Player,
    coord: AbsoluteCoordinate,
    asUntouched: boolean = false,
    collision: "raise" | "overwrite" | "skip" = "raise"
  ): void {
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
    if (!this.pieceInBoardIndex.get(controller)!.has(kind)) {
      this.pieceInBoardIndex.get(controller)!.set(kind, new Set());
    }
    this.pieceInBoardIndex.get(controller)!.get(kind).add(coord);
  }

  #removePieceFromStand(kind: PieceType, controller: Player): void {
    const activePieceStand = this.pieceStands.get(controller)!;
    switch (activePieceStand.get(kind)) {
      case 0:
        throw new Error(`${kind} is not in piece stand`);
      case 1:
        activePieceStand.delete(kind);
        break;
      default:
        activePieceStand.apply(kind, (value) => value - 1);
    }
  }

  #removePieceFromBoard(coord: AbsoluteCoordinate): void {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`removing null piece (from ${coord})`);
    }
    this.square(coord).piece = null;
    this.pieceInBoardIndex
      .get(piece.controller)!
      .get(piece.constructor as PieceType)
      .delete(coord);
  }

  #moveDestinationFrom(coord: AbsoluteCoordinate): Set<AbsoluteCoordinate> {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`cannot move null (in ${coord})`);
    }
    return piece.validDestination(this, coord);
  }

  #dropDestination(): Set<AbsoluteCoordinate> {
    const destinations = new Set<AbsoluteCoordinate>();
    for (const coord of this.#coordsGenerator) {
      const square = this.square(coord);
      if (!(square.isExcluded || square.piece)) {
        destinations.add(coord);
      }
    }
    return destinations;
  }

  #updateMovablePieceMap() {
    const turnPlayerPieceToValidDestination = new Map<
      AbsoluteCoordinate,
      Set<AbsoluteCoordinate>
    >();
    for (const coords of this.pieceInBoardIndex
      .get(this.turnPlayer)!
      .values()) {
      for (const start of coords) {
        const goal = this.#moveDestinationFrom(start);
        if (goal.size) {
          turnPlayerPieceToValidDestination.set(start, goal);
        }
      }
    }
    this.#movablePieceMapCache = turnPlayerPieceToValidDestination;
  }

  get #currentMovablePieceMap(): Map<
    AbsoluteCoordinate,
    Set<AbsoluteCoordinate>
  > {
    return this.#movablePieceMapCache;
  }

  #move(
    start: AbsoluteCoordinate,
    goal: AbsoluteCoordinate,
    log: PlayLogComplete
  ): void {
    const movingPiece = this.square(start).piece;
    if (!movingPiece) {
      throw new Error(`cannot move null (in ${start})`);
    }
    const capturedPiece = this.square(goal).piece;
    if (capturedPiece) {
      this.#addPieceToStand(
        capturedPiece.ORIGINAL_PIECE,
        movingPiece.controller
      );
      this.#removePieceFromBoard(goal);
    }
    this.#removePieceFromBoard(start);
    this.#addPieceToBoard(
      movingPiece.constructor as PieceType,
      movingPiece.controller,
      goal
    );
    log.state = "complete";
    log.start = start;
    log.goal = goal;
    log.movingPiece = movingPiece.constructor as PieceType;
    log.capturedPiece = capturedPiece?.constructor as PieceType | undefined;
  }

  #drop(
    kind: PieceType,
    coord: AbsoluteCoordinate,
    log: PlayLogComplete
  ): void {
    this.#addPieceToBoard(kind, this.turnPlayer, coord);
    this.#removePieceFromStand(kind, this.turnPlayer);
    log.state = "complete";
    log.goal = coord;
    log.movingPiece = kind;
  }

  #promote(
    kind: PieceType,
    coord: AbsoluteCoordinate,
    log: PlayLogComplete
  ): void {
    const piece = this.square(coord).piece;
    if (!piece) {
      throw new Error(`removing null piece (from ${coord})`);
    }
    this.#removePieceFromBoard(coord);
    this.#addPieceToBoard(kind, piece.controller, coord);
    log.promoteTo = kind;
  }

  #coordToNum(coord: AbsoluteCoordinate): [number, number] {
    return [this.height - coord.y - 1, coord.x];
  }

  #numToCoord(y: number, x: number): AbsoluteCoordinate {
    return new AbsoluteCoordinate(this.height - y - 1, x);
  }

  async game(): Promise<void> {
    const converter = <T extends null | PieceType>(r: [number, number] | T) =>
      r instanceof Array ? this.#numToCoord(...r) : r;
    const playerToNum = (p?: Player): 0 | 1 =>
      p === PlayerIndex.WHITE ? 0 : 1;
    this.IO.initializeBoardVisualization();
    for (const coord of this.#coordsGenerator) {
      const piece = this.square(coord).piece;
      this.IO.renderCell(
        ...this.#coordToNum(coord),
        playerToNum(piece?.controller),
        piece?.SYMBOL ?? "",
        Boolean(piece?.IS_PROMOTED)
      );
    }
    // ゲーム終了までループ
    while (!this.#isGameTerminated[0]) {
      const playLog: PlayLogComplete = {
        state: "defined",
        board: this,
        totalStepCount: this.playLog.length,
        chessTurnCount: this.chessTurnCount,
        turnPlayer: this.turnPlayer,
      } as unknown as PlayLogComplete;
      this.#updateMovablePieceMap();

      this.IO.startTurnMessaging(playerToNum(this.turnPlayer));
      Turn: while (true) {
        const target = converter(
          await this.IO.selectBoard(
            [
              [...this.#movablePieceMapCache.keys()].map(
                this.#coordToNum.bind(this)
              ),
              [...this.pieceStands.get(this.turnPlayer)!.keys()],
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
            await this.IO.selectBoard<undefined>(
              [
                [...this.#currentMovablePieceMap.get(target)!].map(
                  this.#coordToNum.bind(this)
                ),
              ],
              "駒を移動させるマスを選んでください。",
              true
            )
          );
          if (goal === null) {
            continue Turn;
          }
          this.#move(target, goal, playLog);
          let isPromoted: boolean = false;
          if (this.promotionCondition(playLog)) {
            const movingPiece = this.square(goal).piece!;
            const promoteTo = await this.IO.selectPromotion(
              [
                ...movingPiece.PROMOTE_DEFAULT_TRUE,
                ...(movingPiece.FORCE_PROMOTE ? [] : [playLog.movingPiece]),
              ],
              "どの駒に成るかを選んでください"
            );
            if (promoteTo !== playLog.movingPiece) {
              this.#promote(promoteTo, goal, playLog);
              isPromoted = true;
            }
          }
          this.IO.renderCell(
            ...this.#coordToNum(goal),
            playerToNum(this.turnPlayer),
            this.square(goal).piece?.SYMBOL ?? "",
            isPromoted
          );
          this.IO.renderCell(
            ...this.#coordToNum(target),
            playerToNum(this.turnPlayer),
            this.square(target).piece?.SYMBOL ?? "",
            false
          );
          this.IO.renderCapturedPiece(
            playerToNum(this.turnPlayer),
            [...this.pieceStands.get(this.turnPlayer)!.entries()].map(
              ([kind, num]) => ({
                name: new kind(undefined as any).SYMBOL,
                count: num,
              })
            )
          );
          break Turn;
        } else {
          // コマを打つ
          const goal = converter(
            await this.IO.selectBoard<undefined>(
              [[...this.#dropDestination()].map(this.#coordToNum.bind(this))],
              "駒を置くマスを選んでください。",
              true
            )
          );
          if (goal === null) {
            continue Turn;
          }
          this.#drop(target, goal, playLog);
          this.IO.renderCell(
            ...this.#coordToNum(goal),
            playerToNum(this.turnPlayer),
            new target(undefined as any).SYMBOL,
            false
          );
          this.IO.renderCapturedPiece(
            playerToNum(this.turnPlayer),
            [...this.pieceStands.get(this.turnPlayer)!.entries()].map(
              ([kind, num]) => ({
                name: new kind(undefined as any).SYMBOL,
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
    this.IO.showWinner(playerToNum(this.#isGameTerminated[1]));
    return;
  }
}

const players = {
  0: PlayerIndex.WHITE,
  1: PlayerIndex.BLACK,
};

type PlayerExpression = keyof typeof players;
interface IOFunctions {
  initializeBoardVisualization: () => void;
  startTurnMessaging: (player: PlayerExpression) => void;
  showWinner: (player: PlayerExpression) => void;
  selectBoard: <T extends undefined | PieceType>(
    options: T extends PieceType
      ? [[number, number][], T[], Player]
      : [[number, number][]],
    message: string,
    cancel: boolean
  ) => Promise<
    (T extends PieceType ? PieceType : never) | [number, number] | null
  >;
  selectPromotion: (
    options: PieceType[],
    message: string
  ) => Promise<PieceType>;
  renderCell: (
    y: number,
    x: number,
    player: PlayerExpression,
    pieceName: string | "",
    isPromoted: boolean
  ) => void;
  renderCapturedPiece: (
    player: PlayerExpression,
    pieceNameAndNum: { name: string; count: number }[]
  ) => void;
}

const Cell = AbsoluteCoordinate;
const Vector = RelativeCoordinate;
