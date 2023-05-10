"""
動作環境: Python3.10以上
"""

# TODO: (モジュールの)ドキュメントをまとめる
# TODO: 成り条件の個別設定を可能にする
# TODO: 打牌制限(二歩とか)

from __future__ import annotations

from abc import ABC, abstractmethod
from collections import Counter, defaultdict
from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass
from enum import Enum, auto
from pprint import pprint
from typing import Any, ClassVar, Literal, Optional, TypeVar, overload


T = TypeVar('T')

# 盤についての前提条件
#     - マスは正方形であり、頂点が集まるように敷き詰められている
#     - 一マスに存在しうる駒は高々1つ
#     - 駒はマス内もしくは駒台上にのみ存在する
#     - 走り駒は原則、盤の欠けの上を走ることはできない


class Coordinate(ABC):
    """二次元座標の基底クラス
    座標の負の値は、負のインデックスとして解釈される。

    Constructor Params:
        y: +は前, -は後ろ
        x: +は右, -は左
    """
    def __repr__(self) -> str:
        return f"{self.__class__.__name__}{self.__y, self.__x}"

    def __str__(self) -> str:
        return f"{self.__y, self.__x}"

    def __init__(self, y: int, x: int) -> None:
        if not isinstance(y, int):
            raise TypeError("y must be an interger")
        if not isinstance(x, int):
            raise TypeError("x must be an interger")
        self.__y = y
        self.__x = x

    @property
    def y(self):
        """前後方向の座標
        +は前, -は後ろ
        """
        return self.__y

    @property
    def x(self):
        """左右方向の座標
        +は右, -は左
        """
        return self.__x

    def __add__(self, __value: Coordinate):
        if not isinstance(__value, Coordinate):
            raise TypeError
        return type(self)(self.__y+__value.y, self.__x+__value.x)

    def __copy__(self):
        return type(self)(self.__y, self.__x)

    def __hash__(self) -> int:
        return hash((self.__y, self.__x, type(self)))

    def __eq__(self, __value: object) -> bool:
        if type(__value) is not type(self):
            return False
        return (self.__x==__value.x) and (self.__y==__value.y)

class AbsoluteCoordinate(Coordinate):
    """盤面の座標を表すクラス
    座標の負の値は、負のインデックスとして解釈される。

    Constructor Params:
        y: +は前, -は後ろ
        x: +は右, -は左
    """
    def __add__(self, __value: Coordinate):
        if isinstance(__value, AbsoluteCoordinate):
            raise TypeError("cannot add two absolute coordinates")
        return super().__add__(__value)

    __radd__ = __add__

    @property
    def x_inverted(self):
        """x座標を反転させた座標(y, x)を返す"""
        return type(self)(self.y, ~self.x)

    @property
    def y_inverted(self):
        """y座標を反転させた座標(y, x)を返す"""
        return type(self)(~self.y, self.x)

    def __neg__(self):
        return type(self)(~self.y, ~self.x)

    __invert__ = __neg__

    @property
    def full_inverted(self):
        """x, y座標をそれぞれ反転させた座標(y, x)を返す"""
        return -self

    def __pos__(self):
        return self

    @overload
    def __sub__(self, __value: AbsoluteCoordinate) -> RelativeCoordinate: ...
    @overload
    def __sub__(self, __value: RelativeCoordinate) -> AbsoluteCoordinate: ...

    def __sub__(self, __value) -> Coordinate:
        if isinstance(__value, AbsoluteCoordinate):
            return RelativeCoordinate(self.y, self.x) - RelativeCoordinate(__value.y, __value.x)
        if isinstance(__value, RelativeCoordinate):
            return self + (-__value)
        return NotImplemented

    def is_inside(self, board: IBoard, *, strict: bool = True) -> bool:
        """座標が盤面の中に入っているかを判定する
        
        strict=Trueの場合、負のインデックスに対しFalseを返す
        """
        if strict:
            return (0 <= self.y < board.height) and (0 <= self.x < board.width)
        return (-board.height <= self.y < board.height) and (-board.width <= self.x < board.width)

    def normalized_by(self, board: IBoard, *, negative: bool = False):
        """盤面の大きさに合わせて、インデックスを標準形に直す"""
        if not self.is_inside(board, strict=False):
            raise ValueError(f"{self} is out of the board {board.height, board.width}")
        return type(self)(
            self._normalizer(self.y, board.height, negative),
            self._normalizer(self.x, board.width, negative),
        )

    @staticmethod
    def _normalizer(target: int, standard: int, negative: bool = False) -> int:
        if negative:
            if target >= 0:
                return target - standard
        elif target < 0:
            return target + standard
        return target

class RelativeCoordinate(Coordinate):
    """盤面における相対座標を表すクラス"""
    def __abs__(self) -> int:
        return max(abs(self.y), abs(self.x))

    def __add__(self, __value: object):
        if isinstance(__value, RelativeCoordinate):
            return super().__add__(__value)
        return NotImplemented

    @property
    def x_inverted(self):
        """x座標を反転させた座標(y, x)を返す"""
        return type(self)(self.y, -self.x)

    @property
    def y_inverted(self):
        """y座標を反転させた座標(y, x)を返す"""
        return type(self)(-self.y, self.x)

    def __neg__(self):
        return type(self)(-self.y, -self.x)

    __invert__ = __neg__

    @property
    def full_inverted(self):
        """x, y座標をそれぞれ反転させた座標(y, x)を返す"""
        return -self

    def __pos__(self):
        return self

    @property
    def upside_right(self):
        """直線y=xに対して対称に反転させた座標(y, x)を返す"""
        return type(self)(self.x, self.y)

    @property
    def upside_left(self):
        """直線y=-xに対して対称に反転させた座標(y, x)を返す"""
        return type(self)(-self.x, -self.y)


class Controller2P(Enum):
    """駒・ターンのコントローラーを示す

    INDEPENDENT: その他(未使用)
    WHITE: 先手
    BLACK: 後手

    行列演算`@`によって、(左辺)から見た(右辺)の素性を示す`Relation2P`を返す
    """
    INDEPENDENT = auto()
    WHITE = auto()
    BLACK = auto()

    def __matmul__(self, __value: Optional[Controller2P]) -> Relation:
        if self is Controller2P.INDEPENDENT:
            raise NotImplementedError("moving independent piece is not implemented yet")
        if __value is None:
            return Relation.TO_BLANK
        if not isinstance(__value, Controller2P):
            raise TypeError
        if __value is Controller2P.INDEPENDENT:
            raise NotImplementedError("moving independent piece is not implemented yet")
        if self is __value:
            return Relation.FRIEND
        return Relation.ENEMY

    def __str__(self) -> str:
        if self is Controller2P.WHITE:
            return 'White'
        if self is Controller2P.BLACK:
            return 'Black'
        return 'independent'

    def next_player(self):
        """ターン順で次のプレイヤー"""
        if self is Controller2P.WHITE:
            return Controller2P.BLACK
        if self is Controller2P.BLACK:
            return Controller2P.WHITE
        raise NotImplementedError("next turn of absent")


class Relation(Enum):
    """駒同士の関係を示す

    ENEMY: 敵(コントローラーが異なる)
    FRIEND: 味方(コントローラーが同一)
    TO_BLANK: 移動先に駒がない
    """
    FRIEND = auto()
    ENEMY = auto()
    TO_BLANK = auto()


class Approachability(Enum):
    """あるマスに対する駒の移動の可否

    用語を以下に定める
        着地: その地点に駒を移動させる。当該のマスにあった駒は捕獲され、移動した駒のコントローラーの持ち駒となる。その移動の制御者によるさらなる移動先の探索は中止され、制御は次に移る。
        通過: その地点を駒の有効な移動先として登録せずに、制御者を変更せずにその次のマスから探索を続行する。

    REJECT: 着地、通過ともに不可
    END: 着地は可、通過は不可
    ONLY_PASS: 着地は不可、通過は可
    CONTINUE: 着地、通過ともに可
    """
    # (そのマスに止まれるか, そのマスから先に進めるか)
    REJECT = (False, False)
    END = (True, False)
    ONLY_PASS = (False, True)
    CONTINUE = (True, True)

    def __init__(self, can_land: bool, can_go_over: bool) -> None:
        self.__can_land = can_land
        self.__can_go_over = can_go_over

    @property
    def can_land(self):
        """着地可能かを示すブール値"""
        return self.__can_land

    @property
    def can_go_over(self):
        """通過可能かを示すブール値"""
        return self.__can_go_over


class TInteraction:
    # pylint: disable=C0103
    # 上記はクラス定数に対する警告の抑制を目的としている
    """Interactionのテンプレートを定数の形で提供するクラス"""
    @classmethod
    @property
    def NORMAL(cls):
        """通常の駒の移動"""
        return {
            Relation.FRIEND: Approachability.REJECT,
            Relation.ENEMY: Approachability.END,
            Relation.TO_BLANK: Approachability.CONTINUE,
        }.copy()

    @classmethod
    @property
    def NO_CAPTURE(cls):
        """駒を取らない移動"""
        return {
            Relation.FRIEND: Approachability.REJECT,
            Relation.ENEMY: Approachability.REJECT,
            Relation.TO_BLANK: Approachability.CONTINUE,
        }.copy()

    @classmethod
    @property
    def ONLY_CAPTURE(cls):
        """敵の駒を取らなければいけない移動"""
        return {
            Relation.FRIEND: Approachability.REJECT,
            Relation.ENEMY: Approachability.END,
            Relation.TO_BLANK: Approachability.ONLY_PASS,
        }.copy()


class IMove(ABC):
    """駒の動きの静的な定義の表現のインタフェース"""
    def __add__(self, __o: object) -> MoveParallelJoint:
        if not isinstance(__o, IMove):
            raise TypeError
        return MoveParallelJoint(self, __o)

    @abstractmethod
    def coordinates_in_controller(self, controller: Controller2P) -> Any:
        """駒がそのコントローラーの下で動ける方向を示す"""

    @abstractmethod
    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            current_coordinate: AbsoluteCoordinate,
        ) -> set[AbsoluteCoordinate]:
        """諸々から、有効な移動先を返す"""


class IElementalMove(ABC):
    """IMoveDefinitionの子のうち、他のIMoveの合成ではないもののインタフェース"""
    interaction: dict[Relation, Approachability]

    # FIXME: 協調的多重継承
    def __init__(self, interaction: Mapping[Relation, Approachability] = ...) -> None:
        self.interaction = TInteraction.NORMAL
        if interaction is not ...:
            self.interaction.update(interaction)

    def approachability(
            self,
            relation: Relation,
        ) -> Approachability:
        """移動先のマスの駒のコントローラーを参照し、そこに対する挙動を返す"""
        return self.interaction[relation]


class LeaperMove(IMove, IElementalMove):
    """Leaper(跳び駒)の動きの実装"""
    def __init__(
            self,
            coordinates: Iterable[RelativeCoordinate],
            *,
            symmetry: Literal['none', 'lr', 'fblr', 'oct'] = 'none',
            interaction: Mapping[Relation, Approachability] = ...,
        ) -> None:
        super().__init__(interaction)

        self.__coordinates: set[RelativeCoordinate] = set(coordinates)
        if symmetry in ('lr', 'fblr', 'oct'):
            self.__coordinates.update({coord.x_inverted for coord in self.__coordinates})
            if symmetry in ('fblr', 'oct'):
                self.__coordinates.update({coord.y_inverted for coord in self.__coordinates})
                if symmetry == 'oct':
                    self.__coordinates.update({coord.upside_left for coord in self.__coordinates})

    def derive(
            self,
            coordinates: Iterable[RelativeCoordinate] = ...,
            *,
            symmetry: Literal['none', 'lr', 'fblr', 'oct'] = 'none',
            interaction: Optional[Mapping[Relation, Approachability]] = ...,
        ) -> None:
        """自身をコピーしたものを返す
        ただし、引数が与えられたものについては上書きし、
        Noneが与えられたものについてはデフォルトの設定に戻す
        """
        if coordinates is ...:
            coordinates = self.__coordinates
        if interaction is ...:
            interaction = self.interaction
        elif interaction is None:
            interaction = ...
        return self.__class__(
            coordinates,
            symmetry=symmetry,
            interaction=interaction,
        )

    def coordinates_in_controller(self, controller: Controller2P) -> set[RelativeCoordinate]:
        if controller is Controller2P.WHITE:
            return self.__coordinates
        if controller is Controller2P.BLACK:
            return {-coordinate for coordinate in self.__coordinates}
        return set()

    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            current_coordinate: AbsoluteCoordinate,
        ) -> set[AbsoluteCoordinate]:
        destinations: set[AbsoluteCoordinate] = set()
        for movement in self.coordinates_in_controller(controller):
            new_coordinate = current_coordinate + movement
            if not new_coordinate.is_inside(board):
                continue
            target_square = board[new_coordinate]
            if target_square.is_excluded:
                continue
            if target_square.piece:
                relation = controller @ target_square.piece.controller
            else:
                relation = Relation.TO_BLANK
            if self.approachability(relation).can_land:
                destinations.add(new_coordinate)
        return destinations


class RiderMove(IMove, IElementalMove):
    """Rider(走り駒)の動きの実装"""
    def __init__(
            self,
            coordinate_to_dist: Mapping[RelativeCoordinate, int],
            *,
            symmetry: Literal['none', 'lr', 'fblr', 'oct'] = 'none',
            interaction: Mapping[Relation, Approachability] = ...,
        ) -> None:
        super().__init__(interaction)

        self.__coordinate_to_dist: dict[RelativeCoordinate, int] \
            = defaultdict(int, coordinate_to_dist)
        if symmetry in ('lr', 'fblr', 'oct'):
            def adopt_dist(dist_a: int, dist_b: int):
                """同じ方向に移動できる回数を示す2つの値について、他方を包含するものを返す"""
                if dist_a < 0 or dist_b < 0:
                    return -1
                return max(dist_a, dist_b)
            for coord, dist in set(self.__coordinate_to_dist.items()):
                self.__coordinate_to_dist[coord.x_inverted] \
                    = adopt_dist(self.__coordinate_to_dist[coord.x_inverted], dist)
            if symmetry in ('fblr', 'oct'):
                for coord, dist in set(self.__coordinate_to_dist.items()):
                    self.__coordinate_to_dist[coord.y_inverted] \
                        = adopt_dist(self.__coordinate_to_dist[coord.x_inverted], dist)
                if symmetry == 'oct':
                    for coord, dist in set(self.__coordinate_to_dist.items()):
                        self.__coordinate_to_dist[coord.upside_left] \
                            = adopt_dist(self.__coordinate_to_dist[coord.x_inverted], dist)

    def derive(
            self,
            coordinate_to_dist: Mapping[RelativeCoordinate, int],
            *,
            symmetry: Literal['none', 'lr', 'fblr', 'oct'] = 'none',
            interaction: Optional[Mapping[Relation, Approachability]] = ...,
        ) -> None:
        """自身をコピーしたものを返す
        ただし、引数が与えられたものについては上書きし、
        Noneが与えられたものについてはデフォルトの設定に戻す
        """
        if coordinate_to_dist is ...:
            coordinate_to_dist = self.__coordinate_to_dist
        if interaction is ...:
            interaction = self.interaction
        elif interaction is None:
            interaction = ...
        return self.__class__(
            coordinate_to_dist,
            symmetry=symmetry,
            interaction=interaction,
        )

    def coordinates_in_controller(self, controller: Controller2P) -> dict[RelativeCoordinate, int]:
        if controller is Controller2P.WHITE:
            return self.__coordinate_to_dist
        if controller is Controller2P.BLACK:
            return {-coordinate: dist for coordinate, dist in self.__coordinate_to_dist.items()}
        return {}

    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            current_coordinate: AbsoluteCoordinate,
        ) -> set[AbsoluteCoordinate]:
        destinations: set[AbsoluteCoordinate] = set()
        for movement, max_dist in self.coordinates_in_controller(controller).items():
            new_coordinate = current_coordinate
            if max_dist < 0:
                max_dist = max(board.height, board.width)
            for _ in range(max_dist):
                new_coordinate += movement
                if not new_coordinate.is_inside(board):
                    break
                target_square = board[new_coordinate]
                if target_square.is_excluded:
                    break
                if target_square.piece:
                    relation = controller @ target_square.piece.controller
                else:
                    relation = Relation.TO_BLANK
                if self.approachability(relation).can_land:
                    destinations.add(new_coordinate)
                if not self.approachability(relation).can_go_over:
                    break
        return destinations


class MoveParallelJoint(IMove):
    """複数の動きを合わせた動きを作る"""
    def __init__(self, *move: IMove) -> None:
        self.move = move

    def __add__(self, __o: object) -> MoveParallelJoint:
        if not isinstance(__o, IMove):
            raise TypeError
        if isinstance(__o, MoveParallelJoint):
            return MoveParallelJoint(*self.move, *__o.move)
        return MoveParallelJoint(*self.move, __o)

    __radd__ = __add__

    def coordinates_in_controller(self, controller: Controller2P) -> set[RelativeCoordinate]:
        return set().union(
            *(move_element.coordinates_in_controller(controller)
              for move_element in self.move)
        )

    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            current_coordinate: AbsoluteCoordinate
        ) -> set[AbsoluteCoordinate]:
        return set().union(
            *(move_element.valid_destination(board, controller, current_coordinate)
              for move_element in self.move)
        )


class IntroduceClassConstant(type):
    """大文字のみで構成された変数をクラス定数扱いにするメタクラス"""
    def __init__(
        cls,
        __name: str,
        __bases: tuple[type, ...],
        __dict: dict[str, Any],
        **kwds: Any,
    ) -> None:
        super().__init__(__name, __bases, __dict, **kwds)
        cls.__yet_can_assign: dict[str, bool] = {__key: True for __key in cls.ONE_OFF_ASSIGN}
        cls._print_is_can_assign = lambda: cls.__yet_can_assign
        """再代入が1回のみ可能なクラス定数について、その一覧を、まだ代入可能かを返す"""

    def __setattr__(cls, __name: str, __value: Any) -> None:
        if __name == __name.upper():
            if __name not in cls.ONE_OFF_ASSIGN or not cls.__yet_can_assign[__name]:
                raise AttributeError(f"cannot reassign to constant {__name}")
            cls.__yet_can_assign[__name] = False
        return super().__setattr__(__name, __value)

    ONE_OFF_ASSIGN: set[str] = set()
    """1回限りの再代入を許可する定数名の集合"""


class BanConcealClassVar:
    """クラス変数と同名のインスタンス変数の作成を禁止する"""
    def __setattr__(self, __name: str, __value: Any) -> None:
        if hasattr(self.__class__, __name):
            raise AttributeError(f"attribute {__name} is already defined in {self.__class__}")
        return super().__setattr__(__name, __value)


class StrictVarHelper(BanConcealClassVar, metaclass=IntroduceClassConstant):
    """定数(コンスタントケース)の導入, クラス変数の隠蔽防止
    
    1回のみ再代入可能な定数(そのクラス自身を参照する値を代入したい場合を想定)は、
    ONE_OFF_ASSIGN(set[str])に定数名を記述する
    """


class IPiece(StrictVarHelper):
    # pylint: disable=C0103
    # 上記はクラス定数に対する警告の抑制を目的としている
    """駒の抽象クラス"""
    ONE_OFF_ASSIGN = {'PROMOTE_DEFAULT'}
    # PROMOTE_DEFAULTは、「取られたときに何の駒として駒台に載るか」なので、自身を参照する必要があり得る

    def __init__(
            self,
            controller: Controller2P,
            *,
            is_untouched: bool = False,
        ) -> None:
        self.controller = controller
        self.is_untouched = is_untouched

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}"
            f"(controller={self.controller}, is_untouched={self.is_untouched})"
        )

    @property
    def SYMBOL_COLORED(self):
        """プレイヤーによって大文字, 小文字の表示を変えるようにしたSYMBOL
        盤面の表示に使う
        """
        if self.controller is Controller2P.WHITE:
            return self.SYMBOL.upper()
        if self.controller is Controller2P.BLACK:
            return self.SYMBOL.lower()
        return f"\033[33m{self.SYMBOL}\033[0m"  # とりあえず黄色にしている

    NAME: ClassVar[str] = __name__
    """name of piece"""

    MOVE: ClassVar[IMove]
    """move definition of piece"""

    @classmethod
    @property
    def INITIAL_MOVE(cls) -> IMove:
        """move definition of piece, but only appried to the first move"""
        return cls.MOVE

    IS_ROYAL: ClassVar[bool] = False
    """if True, this piece is royal (Player who lost all royal pieces loses the game.)"""

    SYMBOL: ClassVar[str]
    """a character that represents this piece"""

    PROMOTE_DEFAULT: ClassVar[set[type[IPiece]]] = set()
    """デフォルトの成り先(ない場合はNone)"""

    FORCE_PROMOTE: ClassVar[bool] = False
    """成りが存在する場合、強制か否か"""

    @classmethod
    @property
    def ORIGINAL_PIECE(cls) -> type[IPiece]:
        """取られた時に何の駒として持ち駒に加わるか(駒のオモテ面)"""
        return cls

    def valid_destination(
            self,
            board: IBoard,
            my_coordinate: AbsoluteCoordinate,
        ) -> set[AbsoluteCoordinate]:
        """諸々から、有効な移動先を返す"""
        if self.is_untouched:
            referent_move = self.INITIAL_MOVE
        else:
            referent_move = self.MOVE
        return referent_move.valid_destination(board, self.controller, my_coordinate)
        # 以下、もともとの構想
        # cls.MOVEに従って動ける場所を表示する
        # -> クリックでそこに移動し、(駒を取ることを含む段数が)二段以上だったら次の入力を受け付ける
        # このとき、キャンセルボタンで巻き戻せるようにする
        # 諸々正常に完了したら、それを全体に反映し、確定する

    @classmethod
    def as_promotion_of(
            cls,
            original: type[IPiece],
            name: str = ...,
            symbol: str = ...,
        ) -> type[IPiece]:
        """originalが成った状態としてのこの駒を、新たなクラスの形で返す"""
        new_class_name = f"{cls.__name__}From{original.__name__}"
        new_namespace: dict[str, Any] = {}
        if name is ...:
            name = new_class_name
        new_namespace['NAME'] = name
        if symbol is not ...:
            new_namespace['SYMBOL'] = symbol
        new_namespace['PROMOTE_DEFAULT'] = set()
        new_namespace['ORIGINAL_PIECE'] = original
        return type(new_class_name, (cls,), new_namespace)


class Square:
    """盤の中のマス"""
    def __init__(
            self,
            piece: Optional[IPiece] = None,
            *,
            is_excluded: bool = False,
        ) -> None:
        self.piece = piece
        self.is_excluded = is_excluded

    def show_to_console(self) -> str:
        """マスの状態をコンソールに1文字で表示する"""
        if self.is_excluded:
            return '#'
        if self.piece is None:
            return ' '
        return self.piece.SYMBOL_COLORED


@dataclass
class PlayLogUnit:
    """1ターン内のログ(駒の動きなど)の記録単位"""
    board: ClassVar[IBoard] = ...
    total_step_count: int = ...
    chess_turn_count: int = ...
    turn_player: Controller2P = ...
    before_coord: Optional[AbsoluteCoordinate] = ...
    after_coord: AbsoluteCoordinate = ...
    moving_piece: type[IPiece] = ...
    captured_piece: Optional[type[IPiece]] = ...
    promote_to: Optional[type[IPiece]] = None
    # step_in_turn: int = 0
    # serial_number_in_step: int = 0
    @property
    def move_vector(self) -> Optional[RelativeCoordinate]:
        """移動による座標の差分"""
        if self.before_coord is None:
            return None
        return self.after_coord - self.before_coord


class IBoard(ABC):
    """盤の抽象クラス"""
    height: int
    width: int
    board: list[list[Square]]
    piece_in_board_index: dict[Controller2P, dict[type[IPiece], set[AbsoluteCoordinate]]]
    piece_stands: dict[Controller2P, Counter[type[IPiece]]]

    def __getitem__(self, __key: AbsoluteCoordinate) -> Square:
        return self.board[__key.y][__key.x]
    def __setitem__(self, __key: AbsoluteCoordinate, __value: Square):
        self.board[__key.y][__key.x] = __value

    def balance_of(
            self,
            coord: AbsoluteCoordinate,
            controller: Controller2P,
        ) -> tuple[AbsoluteCoordinate, AbsoluteCoordinate]:
        """(下/左からの距離(0始まり), 上/右からの距離(-1始まり))"""
        if controller is Controller2P.WHITE:
            return (
                coord.normalized_by(self, negative=False),
                coord.normalized_by(self, negative=True),
            )
        if controller is Controller2P.BLACK:
            return (
                (-coord).normalized_by(self, negative=False),
                (-coord).normalized_by(self, negative=True),
            )
        raise ValueError(f"unknown controller {controller}")

    @staticmethod
    def square_referer_from_str(referer_str: str) -> AbsoluteCoordinate:
        """棋譜の表記から座標に変換する"""
        x, y = referer_str[0], referer_str[1:]
        return AbsoluteCoordinate(int(y)-1, ord(x)-97)

    @staticmethod
    def square_referer_to_str(coord: AbsoluteCoordinate) -> str:
        """座標から棋譜の表記に変換する"""
        return f"{chr(97+coord.x)}{coord.y+1}"


class TPromotionCondition:
    """promotion_condition(成る条件を表す関数)のテンプレートを提供するクラス"""
    @staticmethod
    def oppornent_field(
            row: int,
            allow_inside: bool = True,
            allow_escape: bool = True,
            allow_enter: bool = True,
            allow_outside: bool = False,
        ) -> Callable[[PlayLogUnit], bool]:
        """敵陣row段目を成りの基準とする"""
        def condition(log: PlayLogUnit) -> bool:
            is_before_in = row >= -log.board.balance_of(log.before_coord, log.turn_player)[1].y
            is_after_in = row >= -log.board.balance_of(log.after_coord, log.turn_player)[1].y
            if is_after_in:
                if is_before_in:
                    return allow_inside
                return allow_enter
            if is_before_in:
                return allow_escape
            return allow_outside
        return condition

    @staticmethod
    def captured_piece() -> Callable[[PlayLogUnit], bool]:
        """このターン中に駒を取っていたら成る"""
        def condition(log: PlayLogUnit) -> bool:
            return log.captured_piece is not None
        return condition


class MatchBoard(IBoard):
    """試合用のボード"""
    def __init__(
            self,
            height: int,
            width: int,
            initial_position: Mapping[AbsoluteCoordinate, IPiece],
            excluded_square: Iterable[AbsoluteCoordinate] = (),
            can_use_captured_piece: bool = False,
            promotion_condition: Callable[[PlayLogUnit], bool] = ...,
            *,
            lr_symmetry: bool = False,
            wb_symmetry: Literal['none', 'face', 'cross'] = 'none',
        ) -> None:
        # 簡単に型チェック
        if not isinstance(height, int):
            raise TypeError("height must be an positive interger")
        if not isinstance(width, int):
            raise TypeError("width must be an positive interger")
        if wb_symmetry not in ('none', 'face', 'cross'):
            raise TypeError(f"{wb_symmetry} is improper value for wb_symmetry")
        # 棋譜の設定
        self.play_log: list[PlayLogUnit] = []
        PlayLogUnit.board = self
        # ターン数のカウント
        self.chess_turn_count = 0
        self.turn_player = Controller2P.WHITE
        # 盤の状態の設定
        self.can_use_captured_piece = can_use_captured_piece
        self.promotion_condition = promotion_condition
        self.height = height
        self.width = width
        # 成りの条件が指定されなかったときのデフォルトとして、敵陣(プレイヤー視点盤面の上1/3)に入ったときに成るようにする
        if promotion_condition is ...:
            self.promotion_condition = TPromotionCondition.oppornent_field(self.height//3)
        # 駒がない状態の盤面を生成
        self.board = [[Square(None) for _ in range(self.width)] for _ in range(self.height)]
        self.piece_stands = {Controller2P.WHITE: Counter(), Controller2P.BLACK: Counter()}
        self.piece_in_board_index = {
            Controller2P.WHITE: defaultdict(set),
            Controller2P.BLACK: defaultdict(set),
        }
        # initial_piecesを元に盤面に駒を置いていく
        excluded_square = {position.normalized_by(self) for position in excluded_square}
        if lr_symmetry:
            initial_position_x_inverted = {
                position.x_inverted.normalized_by(self): piece
                for position, piece in initial_position.items()
            }
            initial_position = initial_position_x_inverted | initial_position
            excluded_square |= {position.x_inverted.normalized_by(self)
                                for position in excluded_square}
        if wb_symmetry == 'face':
            initial_position_face = {
                position.y_inverted.normalized_by(self): type(piece)(piece.controller.next_player())
                for position, piece in initial_position.items()
            }
            initial_position = initial_position_face | initial_position
            excluded_square |= {position.y_inverted.normalized_by(self)
                                for position in excluded_square}
        elif wb_symmetry == 'cross':
            initial_position_cross = {
                (~position).normalized_by(self): type(piece)(piece.controller.next_player())
                for position, piece in initial_position.items()
            }
            initial_position = initial_position_cross | initial_position
            excluded_square |= {(~position).normalized_by(self)
                                for position in excluded_square}
        for square in excluded_square:
            self[square].is_excluded = True
        for position, piece in initial_position.items():
            self.add_piece_to_board(type(piece), piece.controller, position, as_untouched=True)

    @property
    def coords_iterator(self):
        """座標の一覧のイテレータ"""
        return (AbsoluteCoordinate(h, w) for h in range(self.height) for w in range(self.width))

    def visualize_piece_stand(self, player: Controller2P) -> None:
        """コンソールに駒台を表示する"""
        print(f"{str(player)}'s piece stand: ", end='')
        print(', '.join(f"{piece.SYMBOL}-{num}"
                        for piece, num in self.piece_stands[player].items()) or "[no piece]")

    def show_to_console(self) -> None:
        """コンソールに盤面を表示する"""
        h_digit = len(str(self.height+1))
        horizontal_line = '-'*(h_digit-1) + '-+'*(self.width+1)
        horizontal_sep = '='*(h_digit-1) + '=‡'*(self.width+1)
        column_indicator = '\\'*h_digit + '|' + '|'.join(chr(97+w) for w in range(self.width)) + '|'
        print()
        self.visualize_piece_stand(Controller2P.BLACK)
        print(horizontal_line)
        print(column_indicator)
        print(horizontal_sep)
        for h in range(self.height-1, -1, -1):
            print(
                format(h+1, f'#{h_digit}')
                + '|'
                + '|'.join((self[AbsoluteCoordinate(h, w)].show_to_console())
                           for w in range(self.width))
                + '|'
            )
            print(horizontal_line)
        self.visualize_piece_stand(Controller2P.WHITE)
        print()

    def is_game_terminated(self) -> tuple[bool, Optional[Controller2P]]:
        """(ゲームが終了したかの真偽値, 勝者)"""
        remaining_player: set[Controller2P] = {
            player for player in (Controller2P.WHITE, Controller2P.BLACK)
            if any(v for (k, v) in self.piece_in_board_index[player].items() if k.IS_ROYAL)
        }
        if len(remaining_player) > 1:
            return (False, None)
        if remaining_player:
            return (True, remaining_player.pop())
        return (True, None)

    def add_piece_to_stand(self, kind: type[IPiece], controller: Controller2P) -> None:
        """駒台に駒を置く"""
        self.piece_stands[controller][kind] += 1

    def add_piece_to_board(
            self,
            kind: type[IPiece],
            controller: Controller2P,
            coord: AbsoluteCoordinate,
            *,
            as_untouched: bool = False,
            collision: Literal['raise', 'overwrite', 'skip'] = 'raise',
        ) -> None:
        """盤面に駒を置く"""
        if self[coord].is_excluded and collision != 'skip':
            raise ValueError("cannot set a piece to excluded square")
        if self[coord].piece is not None:
            if collision == 'raise':
                raise ValueError(f"piece is already in {coord}")
            if collision == 'skip':
                return
        self[coord].piece = kind(controller, is_untouched=as_untouched)
        self.piece_in_board_index[controller][kind].add(coord)

    def remove_piece_from_stand(self, kind: type[IPiece], controller: Controller2P):
        """駒台から駒を取り除く"""
        active_piece_stand = self.piece_stands[controller]
        if active_piece_stand[kind] == 0:
            raise ValueError(f"{kind} is not in piece stand")
        active_piece_stand[kind] -= 1
        if active_piece_stand[kind] == 0:
            del active_piece_stand[kind]

    def remove_piece_from_board(self, coordinate: AbsoluteCoordinate) -> None:
        """盤面から駒を取り除く"""
        piece = self[coordinate].piece
        if piece is None:
            raise ValueError(f"removing piece from None (in {coordinate})")
        self[coordinate].piece = None
        self.piece_in_board_index[piece.controller][type(piece)].remove(coordinate)

    def move_destination_from(self, coordinate: AbsoluteCoordinate) -> set[AbsoluteCoordinate]:
        """移動元の座標から、移動先として有効な座標を返す"""
        target_piece = self[coordinate].piece
        if target_piece is None:
            raise ValueError(f"cannot move None (in {coordinate})")
        return target_piece.valid_destination(self, coordinate)

    def drop_destination(self) -> set[AbsoluteCoordinate]:
        """駒を打つ先として有効な座標を返す"""
        return {
            coord for coord in self.coords_iterator
            if (not self[coord].is_excluded) and (self[coord].piece is None)
        }

    def movable_piece_mapping(self) -> dict[AbsoluteCoordinate, set[AbsoluteCoordinate]]:
        """ターンプレイヤーの駒のうち、動かせるものについて、dict[今いる位置, set[移動可能な位置]]を返す"""
        dominating_coord = {
            k for i in self.piece_in_board_index[self.turn_player].values() for k in i
        }
        dominating_piece_mapping = {
            depart_coord: self.move_destination_from(depart_coord)
            for depart_coord in dominating_coord
        }
        return {
            depart_coord: destination_coords for depart_coord, destination_coords
            in dominating_piece_mapping.items() if destination_coords
        }

    def move(
            self,
            before_coord: AbsoluteCoordinate,
            after_coord: AbsoluteCoordinate,
            *,
            log: PlayLogUnit,
        ) -> None:
        """駒を実際に動かす"""
        moving_piece = self[before_coord].piece
        captured_piece = self[after_coord].piece
        if captured_piece:
            self.add_piece_to_stand(captured_piece.ORIGINAL_PIECE, moving_piece.controller)
            self.remove_piece_from_board(after_coord)
        self.add_piece_to_board(type(moving_piece), moving_piece.controller, after_coord)
        self.remove_piece_from_board(before_coord)
        log.before_coord = before_coord
        log.after_coord = after_coord
        log.moving_piece = moving_piece
        log.captured_piece = captured_piece

    def drop(self, kind: type[IPiece], coord: AbsoluteCoordinate, *, log: PlayLogUnit) -> None:
        """駒を打つ"""
        self.add_piece_to_board(kind, self.turn_player, coord)
        self.remove_piece_from_stand(kind, self.turn_player)
        log.before_coord = None
        log.after_coord = coord
        log.moving_piece = kind
        log.captured_piece = None

    def promote(self, kind: type[IPiece], coord: AbsoluteCoordinate, *, log: PlayLogUnit) -> None:
        """[coord]にいる駒が[kind]に成る"""
        piece = self[coord].piece
        controller = piece.controller
        self.remove_piece_from_board(coord)
        self.add_piece_to_board(kind, controller, coord)
        log.promote_to = kind

    def game(self):
        """対局を行う"""
        # どちらかのプレイヤーが王駒を全て失うまで対局を続ける
        while not self.is_game_terminated()[0]:
            self.show_to_console()
            movable_piece_mapping = self.movable_piece_mapping()
            play_log_of_this_turn = PlayLogUnit(
                total_step_count=len(self.play_log),
                chess_turn_count=self.chess_turn_count,
                turn_player=self.turn_player,
            )
            # TODO: ループロジック見直し: whileをどう使う?
            # TODO: ステイルメイト対応?
            while True:
                # 駒を動かすか打つかを選択する
                # TODO: merge
                if self.can_use_captured_piece and self.piece_stands[self.turn_player]:
                    mode = select_by_user(
                        ({'move', 'drop'}, str),
                        message="select move or drop",
                        cancel=None,
                        auto_cancel=True,
                        auto_cancel_message="you have no valid move",
                        abbrebiate_single=True,
                        abbrebiate_single_message="",
                    )
                    if mode is None:
                        # ここに「動かせる駒がない」状態のときの処理を書く
                        print("This game was called off.")
                        return
                else:
                    mode = 'move'
                # 先の選択に従い、実際の処理を行う
                if mode == 'move':
                    before_coord = select_by_user(
                        (movable_piece_mapping, self.square_referer_to_str),
                        message="select your piece to move by coordinate:"
                    )
                    if before_coord is None:
                        continue
                    after_coord = select_by_user(
                        (movable_piece_mapping[before_coord], self.square_referer_to_str),
                        message="select the place you want the selected piece to move in:"
                    )
                    if after_coord is not None:
                        self.move(before_coord, after_coord, log=play_log_of_this_turn)
                        if self.promotion_condition(play_log_of_this_turn):
                            promote_to = select_by_user(
                                (self[after_coord].piece.PROMOTE_DEFAULT, lambda kind: kind.SYMBOL),
                                cancel=None,
                                auto_cancel=True,
                                auto_cancel_message="",
                                abbrebiate_single=True,
                                abbrebiate_single_message="",
                            )
                            if promote_to is not None:
                                self.promote(promote_to, after_coord, log=play_log_of_this_turn)
                        break
                elif mode == 'drop':
                    drop_piece = select_by_user(
                        (self.piece_stands[self.turn_player], lambda piece: piece.SYMBOL),
                        message="select piece to drop from your piece stand:",
                    )
                    if drop_piece is None:
                        continue
                    drop_coord = select_by_user(
                        (self.drop_destination(), self.square_referer_to_str),
                        message="select the place you want the selected piece to move in:",
                    )
                    if drop_coord is not None:
                        self.drop(drop_piece, drop_coord, log=play_log_of_this_turn)
                        break
            self.turn_player = self.turn_player.next_player()
            if self.turn_player == Controller2P.WHITE:
                self.chess_turn_count += 1
        self.show_to_console()
        print(f"Game end: the winner is {self.is_game_terminated()[1]}")


def select_by_user(
        *option_and_stringifier: tuple[Iterable[T], Callable[[T], str]],
        message: str = "select from following options: ",
        cancel: Optional[str] = '_c',
        auto_cancel: bool = True,
        auto_cancel_message: str = "Automatically canceled due to no other option is available",
        abbrebiate_single: bool = False,
        abbrebiate_single_message: str = (
            "Automatically selected {} "
            "due to no other option is available"
        ),
    ) -> Optional[T]:
    """ユーザーに選択肢を表示し、選択を行わせる"""
    str_to_option: dict[str, Optional[T]] = {}
    str_to_option[cancel] = None
    # 選択肢と表示形式に変換する関数から、表示, 選択に用いる辞書を生成
    for option_group, stringifier in option_and_stringifier:
        for option in option_group:
            option_str_original = stringifier(option)
            option_str = option_str_original
            i = 1
            while option_str in str_to_option:
                i += 1
                option_str = f'{option_str_original}_{i}'
                print(option_str)
            str_to_option[option_str] = option
    if auto_cancel and len(str_to_option) == 1:
        if auto_cancel_message:
            print(auto_cancel_message)
        return None
    if abbrebiate_single and len(str_to_option) == 2:
        del str_to_option[cancel]
        choice: T = set(str_to_option.values()).pop()
        if abbrebiate_single_message:
            print(abbrebiate_single_message.format(choice))
        return choice
    if cancel is None:
        del str_to_option[cancel]
    while True:
        if message:
            print(message)
        pprint(sorted(str_to_option))
        choice = input()
        if choice in str_to_option:
            return str_to_option[choice]
        print(f"invalid input: {choice}")


class King(IPiece):
    """チェスのキング
    取られたら負けになる
    動き: 周囲1マスに進める
    """
    NAME = "King"
    MOVE = LeaperMove([RelativeCoordinate(1, 0), RelativeCoordinate(1, 1)], symmetry='oct')
    IS_ROYAL = True
    SYMBOL = 'k'

class Qween(IPiece):
    """チェスのクイーン
    動き: 周囲8方向に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Qween"
    MOVE = RiderMove({RelativeCoordinate(1, 0): -1, RelativeCoordinate(1, 1): -1}, symmetry='oct')
    IS_ROYAL = False
    SYMBOL = 'q'

class Bishop(IPiece):
    """チェスのビショップ
    動き: 斜め方向に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Bishop"
    MOVE = RiderMove({RelativeCoordinate(1, 1): -1}, symmetry='fblr')
    IS_ROYAL = False
    SYMBOL = 'b'

class Rook(IPiece):
    """チェスのルーク
    動き: 縦横に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Rook"
    MOVE = RiderMove({RelativeCoordinate(1, 0): -1}, symmetry='oct')
    IS_ROYAL = False
    SYMBOL = 'r'

class Knight(IPiece):
    """チェスのナイト
    動き: 途中の駒を飛び越えて、縦か横に2マス進んでから、それと垂直な方向に1マス進んだマスに進める
    """
    NAME = "Knight"
    MOVE = LeaperMove([RelativeCoordinate(2, 1)], symmetry='oct')
    IS_ROYAL = False
    SYMBOL = "n"

class Pawn(IPiece):
    """チェスのポーン
    動き: とりあえず省略
    """
    NAME = "Pawn"
    MOVE = MoveParallelJoint(
        LeaperMove(
            [RelativeCoordinate(1, 0)],
            symmetry='none',
            interaction=TInteraction.NO_CAPTURE
        ),
        LeaperMove(
            [RelativeCoordinate(1, 1)],
            symmetry='lr',
            interaction=TInteraction.ONLY_CAPTURE
        ),
    )
    INITIAL_MOVE = MoveParallelJoint(
        RiderMove(
            {RelativeCoordinate(1, 0): 2},
            symmetry='none',
            interaction=TInteraction.NO_CAPTURE
        ),
        LeaperMove(
            [RelativeCoordinate(1, 1)],
            symmetry='lr',
            interaction=TInteraction.ONLY_CAPTURE
        ),
    )
    IS_ROYAL = False
    SYMBOL = "p"
    FORCE_PROMOTE = True
Pawn.PROMOTE_DEFAULT = {kind.as_promotion_of(Pawn) for kind in (Qween, Bishop, Rook, Knight)}


if __name__ == '__main__':
    initial_piece_position: dict[AbsoluteCoordinate, IPiece] = {
        AbsoluteCoordinate(0, 3): King(Controller2P.WHITE),
        AbsoluteCoordinate(0, 4): Qween(Controller2P.WHITE),
        AbsoluteCoordinate(0, 0): Rook(Controller2P.WHITE),
        AbsoluteCoordinate(0, 2): Bishop(Controller2P.WHITE),
        AbsoluteCoordinate(0, 1): Knight(Controller2P.WHITE),
        **{AbsoluteCoordinate(1, n): Pawn(Controller2P.WHITE) for n in range(4)},
    }
    play_board = MatchBoard(
        height=6, # 8,
        width=5, # 8,
        initial_position=initial_piece_position,
        lr_symmetry=True,
        wb_symmetry='face',
        can_use_captured_piece=True,
        promotion_condition=TPromotionCondition.oppornent_field(row=1),
    )
    play_board.game()
