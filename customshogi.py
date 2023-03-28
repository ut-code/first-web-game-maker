"""
動作環境: Python3.10以上

前提
    1. 参加者が作成するものであるから、カスタマイズはコードの編集で行う
    2. 隠蔽された実装を考えさせないようにする(挙動をシンプルにする)
        -> でもブラックボックスが多くなるのもな...
そもそもどのような部品の組み合わせにするか?
(ロジック, グラフィック)/(盤, 駒)
※駒が
①盤(抽象)
    二次元配列で盤(及び駒台)を表し、各要素がその升目にある駒(/何もない/盤の欠け)を表す。
②盤(描画)
    ①を可視化する。デザインのカスタマイズもここで行う。
③駒(抽象)
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from collections import Counter
from collections.abc import Mapping, Container, Callable
from enum import Enum, auto
from typing import Any, NamedTuple, Optional, Literal, TypeAlias

# 暫定的な駒の動きの制限(obsolete):
#     1. 走る方向は45°刻みの8方向のみで、距離の制限はなく、飛び越しはできない
#     2? 跳ぶ先はチェビシェフ距離2(その駒を中心とする5*5の正方形領域)の升に限る
#     3. 二段移動不可(ライノセラス, ライオン等)
#     4. 駒を取るときと取らないときで動き方は同一
#     5. 全ての駒は、コントロールするプレイヤーが異なる全ての駒に取られ得る
#     6. 相手の駒のいるマスに移動することによってのみ、その駒を取ることができる
#     7. 全ての駒について、その駒を駒台から打つことができるか否かは斉一
#     8. 駒を打つときは生駒として打つ
#     9. 駒を打つことができるのは、盤面のうち他の駒がいないマスのみである


# 二段行動の実装について
# -> 各駒(?)に残り行動回数的な内部状態を持たせ、それがゼロになった段階で動作を終了させる


# TODO: どう考えても、「ユーザーに選択肢を表示し、選択を行わせる」関数が必要


# Board?に以下の情報を持たせておく...
# - 持ち駒使用可否
#     - 使用可(駒定義上書き)
#     - 使用可(駒定義上書き)


# 「成る(駒の種類を変化させる)条件」を表すオブジェクトが必要っぽい...
# - 条件
#     - (指定の)駒を取ったとき
#     - 取られたとき
#     - 盤上の指定の領域に入ったとき
#     - 動作後
# - オプション
#     - 任意/強制


# TODO: そもそも色々な判定のチェックポイント(タイミング)はどうするのか

# - ターン毎自動処理(e.g. 勝利/敗北判定)
# - ステップ毎自動処理(e.g. 焼く)
# - 成り判定
# - 取りを含む二段行動の各段

# 
# 流れとしては
# - ターン開始
# - 駒取りを起こし得る各段について...
#     - 動かす(動き -> 取り / 打ち)
#     - 成り判定/処理(成り)
#     - ステップ毎自動処理
# を繰り返す
# - ターン毎自動処理(王駒)


# そもそも各表現(定義?)クラスは何を管轄しているのか?
# - MOVE
#     - 駒の座標の変更
# - CHANGE
#     - 駒の取り替え(削除/追加)
# - DROP
#     - 駒の座標の変更(self[None -> AbsCoord])
# - CAPTURE
#     - 駒を取る際にそれが適当かを判断する


# 棋譜: 何を表すべきか?
#     - 移動前の駒の座標
#     - 移動後の駒の座標
#     - 取られた駒のリスト


# 駒を取ったときの情報:
# - 何が取ったか
# - 何が取られたか
# - 殺した/射た


# 盤について課す制限
#     - マスは正方形であり、頂点が集まるように敷き詰められている
#     - 一マスに存在しうる駒は高々1つ
#     - 駒はマス内もしくは駒台上にのみ存在する
#     - 走り駒は原則、盤の欠けの上を走ることはできない


# とりあえず実装しない機能
#     - 棋譜
#     - プレイグラウンド
#     - 盤反転
#     - 二段行動: Lion, Rhinoceros
#     - 他の駒を飛び越えることで動く・駒を取る駒: Grasshopper, Bow, Cannon
#     - 他の駒の利きを参照して動きが変化する駒: Joker, Orphan, Friend
#     - 他の駒の動きを変化させる駒: Immovilizer, Ala, Hia
#     - 他の駒を、その升に移動することなく取る駒: 仏狼機, 神機車
#     - 他の駒の状態に影響する駒: 記室, 聖燈, 鼓


# """盤[行][列]"""
# 盤の欠けは専用の駒で表現する?
# 何もないマスはNone?
# とりあえず簡単な計算(現在の盤面を変えずに逐次探索すれば目的地が見つかる)ものについてだけ考える(これでも相当広い)

# TODO: Squareのfieldを分割する
# TODO: catchability vs approachability vs accessibility


class Coordinate(ABC):
    """二次元座標の基底クラス"""
    def __init__(self, y: int, x: int) -> None:
        if not isinstance(y, int):
            raise TypeError("y must be an interger")
        if not isinstance(x, int):
            raise TypeError("x must be an interger")
        self.__y = y
        self.__x = x

    @property
    def y(self):
        return self.__y

    @property
    def x(self):
        return self.__x

    def __add__(self, __o: object):
        if not isinstance(__o, Coordinate):
            raise TypeError
        return type(self)(self.y+__o.y, self.x+__o.x)

    def __copy__(self):
        return type(self)(self.y, self.x)

    def __hash__(self) -> int:
        return hash((self.y, self.x, type(self)))

class AbsoluteCoordinate(Coordinate):
    """盤面の座標を表すクラス"""
    def __init__(self, y: int, x: int) -> None:
        if y < 0 or x < 0:
            raise ValueError("absolute coordinate must be non-negative")
        super().__init__(y, x)

    def __add__(self, __o: object):
        if isinstance(__o, AbsoluteCoordinate):
            raise TypeError("cannot add two absolute coordinates")
        return super().__add__(__o)

    __radd__ = __add__

class RelativeCoordinate(Coordinate):
    """盤面における相対座標を表すクラス"""
    def __abs__(self) -> int:
        return max(abs(self.y), abs(self.x))

    def __add__(self, __o: object):
        if isinstance(__o, RelativeCoordinate):
            return super().__add__(__o)
        return NotImplemented

    @property
    def x_inverted(self):
        return type(self)(self.y, -self.x)

    @property
    def y_inverted(self):
        return type(self)(-self.y, self.x)

    def __neg__(self):
        return type(self)(-self.y, -self.x)

    __invert__ = __neg__

    def __pos__(self):
        return super().__copy__

    @property
    def upside_right(self):
        return type(self)(self.x, self.y)

    @property
    def upside_left(self):
        return type(self)(-self.x, -self.y)


class IMoveDefinition(ABC):
    @abstractmethod
    def valid_destinations(self, board: IBoard, my_coordinate: tuple[int, int]): ...


class MoveMixin(ABC):
    def reverse(self):
        ...


class Controller2P(Enum):
    """駒のコントローラーを示す

    ABSENT: 空きマス
    WHITE: 先手
    BLACK: 後手

    行列演算`@`によって、(左辺)から見た(右辺)の素性を示す`Relation2P`を返す
    """
    ABSENT = auto()
    WHITE = auto()
    BLACK = auto()

    def __matmul__(self, __o: object) -> Relation:
        if not isinstance(__o, Controller2P):
            raise TypeError
        if self is Controller2P.ABSENT:
            raise NotImplementedError("move from independent")
        if __o is Controller2P.ABSENT:
            return Relation.TO_BLANK
        if self is __o:
            return Relation.FRIEND
        return Relation.ENEMY


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


class LogUnit(NamedTuple):
    move_unit: RelativeCoordinate
    move_managing_class: type[IMoveDefinition]
    additional_information: dict


class InTurnLog(list[LogUnit]):
    pass


_NotImplementedType: TypeAlias = Any

class LeaperMove():
    """Leaper(跳び駒)の動きの実装"""
    SIMPLE_CALC = True
    # 全駒捕獲できるようにしておくが、後々変えるかもしれない
    # catchability: 移動先のマスの駒のコントローラーを参照し、そこに対する挙動を返す
    def __init__(
            self,
            coordinates: Container[RelativeCoordinate],
            *,
            symmetry: Literal['none', 'h', 'vh', 'oct'] = 'none',
            catchability_categolized: Mapping[Relation, Approachability] = ...,
            catchability_detail: Callable[[Relation, IPiece], Approachability | _NotImplementedType] = ...,
        ) -> None:
        # とりあえずcatchability_functionは駒の種類のみ参照するが、そのうちIBoardとかも参照するように改修するかもしれない...やりたくねえ...
        self.__coordinates: set[RelativeCoordinate] = set(coordinates)
        if symmetry in ('h', 'vh', 'oct'):
            self.__coordinates.update({coord.x_inverted for coord in self.__coordinates})
            if symmetry in ('vh', 'oct'):
                self.__coordinates.update({coord.y_inverted for coord in self.__coordinates})
                if symmetry == 'oct':
                    self.__coordinates.update({coord.upside_left for coord in self.__coordinates})

        self.catchability_mapping = {
            Relation.FRIEND: Approachability.REJECT,
            Relation.ENEMY: Approachability.END,
            Relation.TO_BLANK: Approachability.CONTINUE,
        }
        if catchability_categolized is not ...:
            self.catchability_mapping.update(catchability_categolized)

        self.catchability_detail = catchability_detail
        if catchability_detail is ...:
            self.catchability_detail = lambda relation, piece: NotImplemented

    def derive_to(
            self,
            coordinates: Container[RelativeCoordinate] = ...,
            *,
            symmetry: Literal['none', 'h', 'vh', 'oct'] = 'none',
            catchability_categolized: Optional[Mapping[Relation, Approachability]] = ...,
            catchability_detail: Optional[Callable[[Relation, IPiece], Approachability | NotImplemented]] = ...,
        ) -> None:
        """自身をコピーしたものを返す
        ただし、引数が与えられたものについては上書きし、
        Noneが与えられたものについてはデフォルトの設定に戻す
        """
        if coordinates is ...:
            coordinates = self.__coordinates

        if catchability_categolized is ...:
            catchability_categolized = self.catchability_mapping
        elif catchability_categolized is None:
            catchability_categolized = ...

        if catchability_detail is ...:
            catchability_detail = self.catchability_detail
        elif catchability_detail is None:
            catchability_detail = ...

        return self.__class__(
            coordinates,
            symmetry=symmetry,
            catchability_categolized=catchability_categolized,
            catchability_detail=catchability_detail
        )

    def approachability(
            self,
            relation: Relation,
            piece: IPiece,
        ) -> Approachability | _NotImplementedType:
        catchability = self.catchability_detail(relation, piece)
        if catchability is not NotImplemented:
            return catchability
        return self.catchability_mapping[relation]

    def coordinates(self, controller: Controller2P) -> set[RelativeCoordinate]:
        """駒がそのコントローラーの下で動けるマスを示す"""
        if controller is Controller2P.WHITE:
            return self.__coordinates
        if controller is Controller2P.BLACK:
            return {-coordinate for coordinate in self.__coordinates}
        return set()

    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            my_coordinate: AbsoluteCoordinate,
            in_turn_log: InTurnLog,
        ) -> set:
        destinations: set[AbsoluteCoordinate] = set()
        for movement in self.coordinates(controller):
            new_coordinate = my_coordinate + movement
            target_square = board[new_coordinate]


# class MoveSerialJoint():
#     def __init__(self) -> None:
#         pass


# class MoveParallelJoint():
#     def __init__(self) -> None:
#         pass


class IPiece(ABC):
    @property
    @abstractmethod
    def NAME(self) -> str:
        """name of piece"""

    @property
    @abstractmethod
    def MOVE(self) -> IMoveDefinition:
        """move definition of piece"""

    @property
    @abstractmethod
    def CHANGE(self) -> IMoveDefinition:
        """change definition of piece"""

    @property
    @abstractmethod
    def DROP(self) -> IMoveDefinition:
        """droppable place definition of piece"""

    @classmethod
    def generate(cls, class_name: str, name: str, move: IMoveDefinition, royalty: int = 0):
        if class_name in globals():
            raise ValueError(f"name collision: name {class_name} is already used")
        return type(class_name, (cls,), {"NAME": name, "MOVE": move})

    def __init__(
            self,
            coordinate: Optional[AbsoluteCoordinate],
            controller: int,
        ) -> None:
        self.coordinate = coordinate
        self.controller = controller
        self.is_untouched = True

    def move(self):
        ...
        # cls.MOVEに従って動ける場所を表示する
        # -> クリックでそこに移動し、(駒を取ることを含む段数が)二段以上だったら次の入力を受け付ける
        # このとき、キャンセルボタンで巻き戻せるようにする
        # 諸々正常に完了したら、


class IPieceWrapper:
    def __init__(self, piece: IPiece) -> None:
        self.piece: Optional[IPiece] = None

    def __setattr__(self, __name: str, __value: Any) -> None:
        pass


class NullPiece(IPiece):
    NAME = "Null"
    MOVE = ...
    CHANGE = ...
    DROP = ...


class Square:
    def __init__(
            self,
            piece: IPiece = NullPiece,
            field: Callable[[IPiece], IPiece] = lambda x: x,
            *,
            accessibility: Callable[[IPiece], Approachability],
        ) -> None:
        self.piece = piece
        self.field = field
        self.accessibility = accessibility


class IBoard(ABC):
    board: list[list[Square]]
    piece_index: dict[type[IPiece], list[AbsoluteCoordinate]]
    piece_stands: Counter[type[IPiece]]
    def __getitem__(self, __key: AbsoluteCoordinate) -> Square:
        return self.board[__key.y][__key.x]


class MatchBoard(IBoard):
    def __init__(self, initial_position: list[list[Square]]) -> None:
        self.player = Controller2P.WHITE
        self.height = len(initial_position)
        self.width = len(initial_position[0])
        self.board = initial_position
        # 先手が0, 後手が1
        self.piece_stands = Counter()

    def valid_destination(self, coordinate: AbsoluteCoordinate):
        target_square = self[coordinate]
        if target_square is None:
            return None

    def drop_destination(self, piece_type: type[IPiece]):
        ...
