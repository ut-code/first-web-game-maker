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
from collections import Counter, defaultdict
from collections.abc import Container
from enum import Enum, auto
from typing import Any, Optional, Literal


def choose_by_user(option: set[str]):
    """ユーザーに選択肢を表示し、選択を行わせる"""
    while True:
        print("choose from the below")
        print(*option, sep=", ")
        choice = input()
        if choice in option:
            return choice
        print(f"invalid choice: {choice}")


# 盤について課す制限
#     - マスは正方形であり、頂点が集まるように敷き詰められている
#     - 一マスに存在しうる駒は高々1つ
#     - 駒はマス内もしくは駒台上にのみ存在する
#     - 走り駒は原則、盤の欠けの上を走ることはできない


# """盤[行][列]"""
# 何もないマスはNone?


class Coordinate(ABC):
    """二次元座標の基底クラス"""
    def __str__(self) -> str:
        return f"{self.__class__.__name__}{self.y, self.x}"

    __repr__ = __str__

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

    # TODO: なんかhashがおかしいが__eq__で動いた
    def __hash__(self) -> int:
        return hash((self.y, self.x))#, type(self)))

    def __eq__(self, __value: object) -> bool:
        if type(__value) != type(self):
            return False
        return (self.x==__value.x) and (self.y==__value.y)

class AbsoluteCoordinate(Coordinate):
    """盤面の座標を表すクラス
    負の値は、負のインデックスとして解釈される。
    """
    def __add__(self, __o: object):
        if isinstance(__o, AbsoluteCoordinate):
            raise TypeError("cannot add two absolute coordinates")
        return super().__add__(__o)

    __radd__ = __add__

    @property
    def x_inverted(self):
        return type(self)(self.y, ~self.x)

    @property
    def y_inverted(self):
        return type(self)(~self.y, self.x)

    def __neg__(self):
        return type(self)(~self.y, ~self.x)

    __invert__ = __neg__

    def __pos__(self):
        return super().__copy__

    @property
    def upside_right(self):
        return type(self)(self.x, self.y)

    @property
    def upside_left(self):
        return type(self)(~self.x, ~self.y)

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
        return super().__copy__()

    @property
    def upside_right(self):
        return type(self)(self.x, self.y)

    @property
    def upside_left(self):
        return type(self)(-self.x, -self.y)


class Controller2P(Enum):
    """駒・ターンのコントローラーを示す

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


class IMoveDefinition(ABC):
    """"""
    @abstractmethod
    def valid_destination(
            self,
            board: IBoard,
            controller: Controller2P,
            my_coordinate: AbsoluteCoordinate,
        ) -> set[AbsoluteCoordinate]:
        """諸々から、有効な移動先を返す"""

    @abstractmethod
    def coordinates(self, controller: Controller2P) -> set[RelativeCoordinate]:
        """駒がそのコントローラーの下で動けるマスを示す"""

    @abstractmethod
    def approachability(
            self,
            relation: Relation,
        ) -> Approachability:
        """移動先のマスの駒のコントローラーを参照し、そこに対する挙動を返す"""


class LeaperMove(IMoveDefinition):
    """Leaper(跳び駒)の動きの実装"""
    def __init__(
            self,
            coordinates: Container[RelativeCoordinate],
            *,
            symmetry: Literal['none', 'h', 'vh', 'oct'] = 'none',
        ) -> None:
        self.__coordinates: set[RelativeCoordinate] = set(coordinates)
        if symmetry in ('h', 'vh', 'oct'):
            self.__coordinates.update({coord.x_inverted for coord in self.__coordinates})
            if symmetry in ('vh', 'oct'):
                self.__coordinates.update({coord.y_inverted for coord in self.__coordinates})
                if symmetry == 'oct':
                    self.__coordinates.update({coord.upside_left for coord in self.__coordinates})

        self.approachability_mapping = {
            Relation.FRIEND: Approachability.REJECT,
            Relation.ENEMY: Approachability.END,
            Relation.TO_BLANK: Approachability.CONTINUE,
        }

    def derive_to(
            self,
            coordinates: Container[RelativeCoordinate] = ...,
            *,
            symmetry: Literal['none', 'h', 'vh', 'oct'] = 'none',
        ) -> None:
        """自身をコピーしたものを返す
        ただし、引数が与えられたものについては上書きし、
        Noneが与えられたものについてはデフォルトの設定に戻す
        """
        if coordinates is ...:
            coordinates = self.__coordinates
        return self.__class__(
            coordinates,
            symmetry=symmetry,
        )

    def approachability(
            self,
            relation: Relation,
        ) -> Approachability:
        return self.approachability_mapping[relation]

    def coordinates(self, controller: Controller2P) -> set[RelativeCoordinate]:
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
        ) -> set[AbsoluteCoordinate]:
        destinations: set[AbsoluteCoordinate] = set()
        for movement in self.coordinates(controller):
            new_coordinate = my_coordinate + movement
            # TODO: 修正
            # if not (0 <= new_coordinate.y < board.height and 0 <= new_coordinate.x <= board.width):
            #     break
            target_square = board[new_coordinate]
            if not target_square.is_lack:
                if target_square.piece:
                    relation = controller @ target_square.piece.controller
                else:
                    relation = Relation.TO_BLANK
                if self.approachability(relation).can_land:
                    destinations.add(new_coordinate)
        return destinations


# class MoveParallelJoint():
#     def __init__(self) -> None:
#         pass


class IPiece(ABC):
    """コマの抽象クラス"""
    def __str__(self) -> str:
        return self.NAME

    __repr__ = __str__

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
    def ROYALTY(self) -> bool:
        """if True, this piece is royal"""

    @property
    @abstractmethod
    def SYMBOL(self) -> str:
        """a character that represents this piece"""

    def __init__(
            self,
            coordinate: Optional[AbsoluteCoordinate],
            controller: Controller2P,
        ) -> None:
        self.coordinate = coordinate
        self.controller = controller

    def valid_destination(
            self,
            board: IBoard,
            my_coordinate: AbsoluteCoordinate
        ) -> set[AbsoluteCoordinate]:
        """諸々から、有効な移動先を返す"""
        return self.MOVE.valid_destination(board, self.controller, my_coordinate)
        # 以下、もともとの構想
        # cls.MOVEに従って動ける場所を表示する
        # -> クリックでそこに移動し、(駒を取ることを含む段数が)二段以上だったら次の入力を受け付ける
        # このとき、キャンセルボタンで巻き戻せるようにする
        # 諸々正常に完了したら、


class Square:
    """盤の中のマス"""
    def __init__(
            self,
            piece: Optional[IPiece] = None,
            *,
            is_lack: bool = False,
        ) -> None:
        self.piece = piece
        self.is_lack = is_lack


class IBoard(ABC):
    height: int
    width: int
    board: list[list[Square]]
    piece_in_board_index: dict[Controller2P, dict[type[IPiece], set[AbsoluteCoordinate]]]
    piece_stands: dict[Controller2P, Counter[type[IPiece]]]
    def __getitem__(self, __key: AbsoluteCoordinate) -> Square:
        return self.board[__key.y][__key.x]
    def __setitem__(self, __key: AbsoluteCoordinate, __value: Any):
        self.board[__key.y][__key.x] = __value


class MatchBoard(IBoard):
    def __init__(self, initial_position: list[list[Square]]) -> None:
        self.turn_player = Controller2P.WHITE
        self.height = len(initial_position)
        self.width = len(initial_position[0])
        self.board = []
        for h in range(self.height):
            self.board.append([])
            for w in range(self.width):
                self.board[h].append(Square(initial_position[h][w]))
        self.piece_stands = {Controller2P.WHITE: Counter(), Controller2P.BLACK: Counter()}
        self.piece_in_board_index = {Controller2P.WHITE: defaultdict(set), Controller2P.BLACK: defaultdict(set)}
        for h in range(self.height):
            for w in range(self.width):
                coord = AbsoluteCoordinate(h, w)
                piece = self[coord].piece
                if piece:
                    self.piece_in_board_index[piece.controller][type(piece)].add(coord)

    @property
    def coords_iterator(self):
        """座標の一覧のイテレータ"""
        return (AbsoluteCoordinate(h, w) for h in range(self.height) for w in range(self.width))

    def show_console(self):
        """コンソールに盤面を表示する"""
        for h in range(self.height):
            print('-'*(self.width*2+1))
            print('|'+'|'.join((' ' if not self[AbsoluteCoordinate(h, w)].piece else self[AbsoluteCoordinate(h, w)].piece.SYMBOL) for w in range(self.width))+'|')
        print('-'*(self.width*2+1))

    def is_game_terminated(self) -> tuple[bool, Controller2P]:
        """(ゲームが終了したか, 勝者)"""
        loser = set()
        for controller in (Controller2P.WHITE, Controller2P.BLACK):
            if not any(len(v) for (k, v) in self.piece_in_board_index[controller].items() if k.ROYALTY):
                loser.add(controller)
        if not loser:
            return (False, Controller2P.ABSENT)
        if len(loser) == 2:
            return (True, Controller2P.ABSENT)
        if Controller2P.WHITE in loser:
            return (True, Controller2P.BLACK)
        if Controller2P.BLACK in loser:
            return (True, Controller2P.WHITE)
        raise ValueError("something occured")

    def add_piece_to_stand(self, kind: type[IPiece], controller: Controller2P):
        """駒台にコマを置く"""
        self.piece_stands[controller][kind] += 1

    def add_piece_to_board(self, kind: type[IPiece], controller: Controller2P, coord: AbsoluteCoordinate):
        """盤面にコマを置く"""
        if self[coord].piece is not None:
            raise ValueError(f"piece is already in {coord}")
        self[coord].piece = kind(coord, controller)
        self.piece_in_board_index[controller][kind].add(coord)

    def remove_piece_from_stand(self, kind: type[IPiece], controller: Controller2P):
        """駒台からコマを取り除く"""
        active_piece_stand = self.piece_stands[controller]
        if active_piece_stand[kind] == 0:
            raise ValueError(f"{kind} is not in piece stand")
        active_piece_stand[kind] -= 1

    def remove_piece_from_board(self, coord: AbsoluteCoordinate):
        """盤面からコマを取り除く"""
        piece = self[coord].piece
        if not piece:
            raise ValueError("removing piece is None")
        self[coord].piece = None
        h = self.piece_in_board_index[piece.controller][type(piece)]
        self.piece_in_board_index[piece.controller][type(piece)].remove(coord)

    def move_destination_from(self, coordinate: AbsoluteCoordinate) -> set[AbsoluteCoordinate]:
        """移動元の座標から、有効な移動先を返す"""
        target_piece = self[coordinate].piece
        if target_piece is None:
            return set()
        return target_piece.valid_destination(self, coordinate)

    def drop_destination(self):
        """有効な駒を打つ先を返す"""
        return set(filter(lambda coord: (not self[coord].is_lack) and (self[coord].piece is None), self.coords_iterator))

    def move(self, depart_coord: AbsoluteCoordinate, arrive_coord: AbsoluteCoordinate):
        """コマを実際に動かす"""
        moving_piece = self[depart_coord].piece
        captured_piece = self[arrive_coord].piece
        if captured_piece:
            self.add_piece_to_stand(type(captured_piece), moving_piece.controller)
            self.remove_piece_from_board(arrive_coord)
        self.add_piece_to_board(type(moving_piece), moving_piece.controller, arrive_coord)
        self.remove_piece_from_board(depart_coord)

    def drop(self, kind: type[IPiece], coord: AbsoluteCoordinate):
        """コマを打つ"""
        self.add_piece_to_board(kind, self.turn_player, coord)
        self.remove_piece_from_stand(kind, self.turn_player)
        

    def game(self):
        while not self.is_game_terminated()[0]:
            starting_coord = set.union(*({square_referer_to_str(k) for k in i} for i in self.piece_in_board_index[self.turn_player].values()))
            while True:
                depart_coord_str = choose_by_user(starting_coord.union({'cancel'}))
                if depart_coord_str != 'cancel':
                    depart_coord = square_referer_from_str(depart_coord_str)
                    destination = {square_referer_to_str(j) for j in self.move_destination_from(depart_coord)}
                    arrive_coord_str = choose_by_user(destination.union({'cancel'}))
                    if arrive_coord_str != 'cancel':
                        arrive_coord = square_referer_from_str(arrive_coord_str)
                        self.move(depart_coord, arrive_coord)
                        break
                    print("re-selecting...")
            self.show_console()
            self.turn_player = self.turn_player.next_player()
        print(f"game end: winner is {self.is_game_terminated()[1]}")


king_move = LeaperMove([RelativeCoordinate(0, 1), RelativeCoordinate(1, 1)], symmetry='oct')


class King(IPiece):
    NAME = "King"
    MOVE = king_move
    ROYALTY = True
    SYMBOL = "k"



def square_referer_from_str(referer_str: str) -> AbsoluteCoordinate:
    return AbsoluteCoordinate(*(int(i) for i in referer_str.split('_')))

def square_referer_to_str(coord: AbsoluteCoordinate) -> str:
    return f"{coord.y}_{coord.x}"


if __name__ == '__main__':
    p = [[None, King(AbsoluteCoordinate(2, 1), Controller2P.WHITE), None], [None, None, None], [None, King(AbsoluteCoordinate(0, 1), Controller2P.BLACK), None]]
    board = MatchBoard(initial_position=p)
    board.game()

