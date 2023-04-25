"""
動作環境: Python3.10以上
"""

# TODO: (モジュールの)ドキュメントをまとめる
# TODO: 成りの追加(設定可能にする)
# TODO: 持ち駒機能の追加(切り替え可能にする)
    # TODO: 打牌
    # TODO: 打牌制限(二歩とか)

from __future__ import annotations
from abc import ABC, abstractmethod
from collections import Counter, defaultdict
from collections.abc import Iterable, Mapping, Callable
from enum import Enum, auto
from typing import Any, NamedTuple, Optional, Literal, TypeVar, overload
from pprint import pprint


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

    def normalized_by(self, board: IBoard):
        """盤面の大きさに合わせて、負のインデックスを標準形に直す"""
        return type(self)(
            self._normalizer(self.y, board.height),
            self._normalizer(self.x, board.width),
        )

    @staticmethod
    def _normalizer(target: int, standard: int) -> int:
        if target < -standard or standard <= target:
            raise ValueError(f"target coordinate {target} is out of range{-standard, standard}")
        if target < 0:
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


class InteractionTemplate:
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
        self.interaction = InteractionTemplate.NORMAL
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
            if not board.includes(new_coordinate):
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
                if not board.includes(new_coordinate):
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


class IPiece(ABC):
    # pylint: disable=C0103
    # 上記はクラス定数に対する警告の抑制を目的としている
    """駒の抽象クラス"""
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

    @classmethod
    @property
    def NAME(cls) -> str:
        """name of piece"""
        return cls.__name__

    @classmethod
    @property
    @abstractmethod
    def MOVE(cls) -> IMove:
        """move definition of piece"""
        raise NotImplementedError

    @classmethod
    @property
    def INITIAL_MOVE(cls) -> IMove:
        """move definition of piece, but only appried to the first move"""
        return cls.MOVE

    @classmethod
    @property
    def ROYALTY(cls) -> bool:
        """if True, this piece is royal (Player who lost all royal pieces loses the game.)"""
        return False

    @classmethod
    @property
    @abstractmethod
    def SYMBOL(cls) -> str:
        """a character that represents this piece"""
        raise NotImplementedError

    @classmethod
    @property
    def PROMOTE_DEFAULT(cls) -> Optional[type[IPiece]]:
        """デフォルトの成り先(ない場合はNone)"""
        return None

    @classmethod
    @property
    def FORCE_PROMOTE(cls) -> bool:
        """成りが存在する場合、強制か否か"""
        return False

    @classmethod
    @property
    def ORIGINAL_PIECE(cls) -> type[IPiece]:
        """取られた時に何の駒として持ち駒に加わるか"""
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


class PlayLogUnit(NamedTuple):
    """1ターン内のログ(駒の動きなど)の記録単位"""
    total_step_count: int
    chess_turn_count: int
    step_in_turn: int
    turn_player: Controller2P
    moving_piece: type[IPiece]
    before_coord: Optional[AbsoluteCoordinate]
    after_coord: AbsoluteCoordinate
    captured_piece: Optional[type[IPiece]] = None
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

    def includes(self, coord: AbsoluteCoordinate) -> bool:
        """座標が盤面の中に入っているかを判定する"""
        return (0 <= coord.y < self.height) and (0 <= coord.x < self.width)

    @staticmethod
    def square_referer_from_str(referer_str: str) -> AbsoluteCoordinate:
        """棋譜の表記から座標に変換する"""
        x, y = referer_str[0], referer_str[1:]
        return AbsoluteCoordinate(int(y)-1, ord(x)-97)

    @staticmethod
    def square_referer_to_str(coord: AbsoluteCoordinate) -> str:
        """座標から棋譜の表記に変換する"""
        return f"{chr(97+coord.x)}{coord.y+1}"


class MatchBoard(IBoard):
    """試合用のボード"""
    def __init__(
            self,
            height: int,
            width: int,
            initial_position: Mapping[AbsoluteCoordinate, IPiece],
            excluded_square: Iterable[AbsoluteCoordinate] = (),
            *,
            lr_symmetry: bool = False,
            wb_symmetry: Literal['none', 'face', 'cross'] = 'none',
        ) -> None:
        if not isinstance(height, int):
            raise TypeError("height must be an positive interger")
        if not isinstance(width, int):
            raise TypeError("width must be an positive interger")
        if wb_symmetry not in ('none', 'face', 'cross'):
            raise TypeError(f"{wb_symmetry} is improper value for wb_symmetry")
        self.turn_player = Controller2P.WHITE
        self.height = height
        self.width = width
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

    def is_game_terminated(self) -> tuple[bool, Controller2P]:
        """(ゲームが終了したかの真偽値, 勝者)"""
        loser = set()
        for controller in (Controller2P.WHITE, Controller2P.BLACK):
            if not any(v for (k, v) in self.piece_in_board_index[controller].items() if k.ROYALTY):
                loser.add(controller)
        if not loser:
            return (False, Controller2P.INDEPENDENT)
        if len(loser) == 2:
            return (True, Controller2P.INDEPENDENT)
        if Controller2P.WHITE in loser:
            return (True, Controller2P.BLACK)
        if Controller2P.BLACK in loser:
            return (True, Controller2P.WHITE)
        raise ValueError("something unexpected occured")

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
        return set(filter(
            lambda coord: (not self[coord].is_excluded) and (self[coord].piece is None),
            self.coords_iterator,
        ))

    def move(self, depart_coord: AbsoluteCoordinate, arrive_coord: AbsoluteCoordinate):
        """駒を実際に動かす"""
        moving_piece = self[depart_coord].piece
        captured_piece = self[arrive_coord].piece
        if captured_piece:
            self.add_piece_to_stand(captured_piece.ORIGINAL_PIECE, moving_piece.controller)
            self.remove_piece_from_board(arrive_coord)
        self.add_piece_to_board(type(moving_piece), moving_piece.controller, arrive_coord)
        self.remove_piece_from_board(depart_coord)

    def drop(self, kind: type[IPiece], coord: AbsoluteCoordinate):
        """駒を打つ"""
        self.add_piece_to_board(kind, self.turn_player, coord)
        self.remove_piece_from_stand(kind, self.turn_player)

    def promote(self, coord: AbsoluteCoordinate) -> None:
        """[coord]にいる駒が成る"""
        piece = self[coord].piece
        controller = piece.controller
        promote_to = piece.PROMOTE_DEFAULT
        self.remove_piece_from_board(coord)
        self.add_piece_to_board(promote_to, controller, coord)

    def game(self):
        """対局を行う"""
        # どちらかのプレイヤーが王駒を全て失うまで対局を続ける
        while not self.is_game_terminated()[0]:
            self.show_to_console()
            movable_piece_mapping = self.movable_piece_mapping()
            while True:
                depart_coord = choose_by_user(
                    (set(movable_piece_mapping), self.square_referer_to_str),
                    message="select your piece to move by coordinate:"
                )
                if depart_coord is None:
                    print("This game was called off.")
                    return
                arrive_coord = choose_by_user(
                    (movable_piece_mapping[depart_coord], self.square_referer_to_str),
                    message="select the place you want the selected piece to move in by coordinate:"
                )
                if arrive_coord is not None:
                    self.move(depart_coord, arrive_coord)
                    break
                print("re-selecting...")
            self.turn_player = self.turn_player.next_player()
        self.show_to_console()
        print(f"game end: winner is {self.is_game_terminated()[1]}")

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

T = TypeVar('T')
def choose_by_user(
        *option_and_stringifier: tuple[set[T], Callable[[T], str]],
        message: str = "select from following options: ",
        cancel: str = "esc",
    ) -> Optional[T]:
    """ユーザーに選択肢を表示し、選択を行わせる"""
    str_to_option: dict[str, Optional[T]] = {cancel: None}
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
    while True:
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
    ROYALTY = True
    SYMBOL = 'k'

class Qween(IPiece):
    """チェスのクイーン
    動き: 周囲8方向に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Qween"
    MOVE = RiderMove({RelativeCoordinate(1, 0): -1, RelativeCoordinate(1, 1): -1}, symmetry='oct')
    ROYALTY = False
    SYMBOL = 'q'

class Bishop(IPiece):
    """チェスのビショップ
    動き: 斜め方向に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Bishop"
    MOVE = RiderMove({RelativeCoordinate(1, 1): -1}, symmetry='fblr')
    ROYALTY = False
    SYMBOL = 'b'

class Rook(IPiece):
    """チェスのルーク
    動き: 縦横に、味方の駒の手前まで、もしくは敵の駒を取るまで進める
    """
    NAME = "Rook"
    MOVE = RiderMove({RelativeCoordinate(1, 0): -1}, symmetry='oct')
    ROYALTY = False
    SYMBOL = 'r'

class Knight(IPiece):
    """チェスのナイト
    動き: 途中の駒を飛び越えて、縦か横に2マス進んでから、それと垂直な方向に1マス進んだマスに進める
    """
    NAME = "Knight"
    MOVE = LeaperMove([RelativeCoordinate(2, 1)], symmetry='oct')
    ROYALTY = False
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
            interaction=InteractionTemplate.NO_CAPTURE
        ),
        LeaperMove(
            [RelativeCoordinate(1, 1)],
            symmetry='lr',
            interaction=InteractionTemplate.ONLY_CAPTURE
        ),
    )
    INITIAL_MOVE = MoveParallelJoint(
        RiderMove(
            {RelativeCoordinate(1, 0): 2},
            symmetry='none',
            interaction=InteractionTemplate.NO_CAPTURE
        ),
        LeaperMove(
            [RelativeCoordinate(1, 1)],
            symmetry='lr',
            interaction=InteractionTemplate.ONLY_CAPTURE
        ),
    )
    ROYALTY = False
    SYMBOL = "p"


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
    )
    play_board.game()
