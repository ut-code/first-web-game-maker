const shogiDescription = `\
# オリジナル将棋を作ってみよう！

駒の種類や盤面をカスタマイズして、オリジナルの将棋ゲームを作ることができます。

## 1. 準備

まず、同じフォルダの中に 3 つのファイル \`index.html\`, \`script.js\`, \`customshogi.js\` を作成してください。

それぞれのファイルを VS Code で開きます。エディタ内部をクリックしてから、画面左の将棋タブの中からファイルと同じ名前のボタンをクリックしてください。コードが挿入されたら準備は完了です。

\`index.html\` ファイルをブラウザで開くと、ゲームを遊ぶことができます。

これから \`script.js\` ファイルに手を加えて、ゲームをカスタマイズしてみましょう。

## 2. ゲームの基本設定

盤面と、ゲームのルールに関する設定です。

\`縦のマス数\`, \`横のマス数\` は、盤面のマスの数を設定します。

\`持ち駒を使うか\` は、取った相手の駒を持ち駒として使えるかどうかです。\`true\` を設定すると、持ち駒を使えます。\`false\` を設定すると、持ち駒は使えず、持ち駒置き場も表示されなくなります。

\`駒が成れる段数\` は、敵陣の何段目に駒が入ると成れるかを数値で指定します。駒が成れるタイミングは、指定した敵陣の範囲に駒が入った時と、敵陣の中から駒が動いた時です。

\`壁マスの座標リスト\` は、駒が侵入できないマスの座標を指定する配列です。複数の座標を指定したい場合はカンマ区切りで入力できます。

### 座標について

座標は \`new Cell(下から何番目か, 左から何番目か)\` という形で表します。ただし、最も下・左のマスを 0 番目と数えることに注意してください。

## 3. 見た目に関する設定

文字やマスの色、大きさなどを簡単に設定できます。変数名にマウスポインターを合わせると、詳しい説明を見ることができます。

\`後手の駒を反転させるか\` は、\`true\` にすると後手の駒の文字を 180 度回転させます。将棋のように駒が向かい合う見た目にしたい場合は \`true\`、チェスのように駒の色のみを変えたい場合は \`false\` を設定してください。

\`色\` は、基本的な色の名前を英語で入力すれば反映されます(\`black\`, \`red\` など)。使用できるすべての色の名前は[こちら](https://developer.mozilla.org/ja/docs/Web/CSS/named-color)で確認できます。また、RGB 値の 16 進表記などでも入力できます(#RRGGBB)。

\`境界線\` は、太さ、色、種類を空白区切りで指定できます。種類には \`solid\`, \`dashed\`, \`double\`, \`none\` などがあります。詳しくは[こちら](https://developer.mozilla.org/ja/docs/Web/CSS/border)をご覧ください。

\`マスの一辺の長さ\` と \`フォントサイズ\` は数値で指定してください。単位は \`px\`(ピクセル)です。

## 4. 駒の種類の設定

### 駒テンプレート

駒の作り方は少し複雑ですが、あらかじめ用意されているテンプレートを利用することも可能です。「駒テンプレート」ボタンを押して id を入力すると、id に応じた駒のテンプレートが挿入できます。

id とテンプレートの種類の対応は次の通りです。

| id  | 種類             |     | id  | 種類       |
| --- | ---------------- | --- | --- | ---------- |
| 0   | 基本テンプレート |     | 9   | キング     |
| 1   | 王将             |     | 10  | クイーン   |
| 2   | 飛車と竜王       |     | 11  | ビショップ |
| 3   | 角行と竜馬       |     | 12  | ルーク     |
| 4   | 金将             |     | 13  | ナイト     |
| 5   | 銀将             |     | 14  | ポーン     |
| 6   | 桂馬             |
| 7   | 香車             |
| 8   | 歩兵             |

### 駒の作り方

書き方の例は次の通りです。

\`\`\`js
class King extends IPiece {
  get NAME() {
    return "King";
  };
  get SYMBOL() {
    return "K";
  };
  MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");
  IS_ROYAL = true;
}
\`\`\`

- \`class クラス名\` : \`クラス名\` には、駒を区別するための名前が入ります。画面には表示されません。
- \`NAME\` : 駒の名前です。画面には表示されません。省略した場合は、 \`クラス名\` に書いた名前になります。
- \`SYMBOL\` : 画面上でその駒を表す文字です。省略した場合は、 \`NAME\` の 1 文字目になります。
- \`MOVE\` : 駒の動きの設定です。詳細は次の項をご覧ください。
- \`IS_ROYAL\` : \`true\` を設定すると、将棋の王将やチェスのキングのように、取られると負ける駒になります。省略した場合は \`false\` となります。
- \`INITIAL_MOVE\`: チェスのポーンのように、最初の 1 回だけ適用される駒の動きを設定できます。書き方が特殊なので、ポーンのテンプレートを参考にしてください。
- \`FORCE_PROMOTE\` : \`true\` を設定すると、成る条件を満たしたときに、強制的に成るようになります。省略した場合は  \`false\` となります。
- \`PROMOTE_DEFAULT\` : どの駒に成ることができるか設定できます。複数設定するとプレイヤーに選択させることができます。次の入力例は、チェスのポーンの場合です。
  
  \`\`\`js
  get PROMOTE_DEFAULT() {
    return new Set([[Qween], [Bishop], [Rook], [Knight]]);
  }
  \`\`\`

  また、駒の名前を、元の駒とは違うものにすることができます。  
  その場合、 \`[クラス名]\` だった部分を、 \`[クラス名, 成った駒のNAME(, 成った駒のSYMBOL)]\` に変えてください。( \`SYMBOL\` は省略できます。)  
  次の入力例は、将棋の歩兵の場合です。

  \`\`\`js
  get PROMOTE_DEFAULT() {
    return new Set([[金将, "と金", "と"]]);
  }
  \`\`\`

### 駒の動きの設定

\`MOVE\` に指定する駒の動きに関する説明です。複雑なので、駒テンプレートを参考にしながら作ってみてください。

まず、駒の動きには \`LeaperMove\` と \`RiderMove\` の 2 種類があり、書き方が少し異なります。それぞれについて説明します。

#### \`LeaperMove\`

特定の位置のマスへの移動です。書き方の例を示します。

例 1(王将) : \`MOVE = new LeaperMove([new Vector(1, 0), new Vector(1, 1)], "oct");\`

例 2(桂馬) : \`MOVE = new LeaperMove([new Vector(1, 2)], "lr");\`

\`[]\` で囲われた部分に、\`new Vector(前に何マス進むか, 右に何マス進むか)\` の形式で移動先を指定します。後ろや左に進む場合は負の値になります。移動先はカンマ区切りで複数指定できます。

\`""\` で囲われた部分は移動方法の対称性を設定でき、次の 4 つの文字列のうちいずれかを指定します。例えば、桂馬の例では前に 2 マス、右に 1 マスの移動が設定されていますが、\`lr\` が指定されているため、左右対称な位置である前に 2 マス、左に 1 マスの移動も可能になります。

- \`none\` : 指定した移動先をそのまま適用します。
- \`lr\` : 移動先を左右対称な位置にコピーします。
- \`fblr\`: 移動先を上下左右対称な位置にコピーします。
- \`oct\`: 移動先を上下左右および斜め 45 度の軸に対称な位置にコピーします。

#### \`RiderMove\`

将棋の飛車や角行のように、特定の方向へ他の駒にぶつかるまで移動できる移動方法です。書き方の例を示します。例 2 は、前後に最大 3 マスまで進める駒の例です。

例 1(角行) : \`MOVE = new RiderMove(new Map([[new Vector(1, 1), -1]]), "fblr");\`

例 2 : \`MOVE = new RiderMove(new Map([[new Vector(1, 0), 3], [new Vector(-1, 0), 3]]), "none");\`

\`[]\` で囲われた部分に、\`[new Vector(x, x), 進める最大マス数]\` の形式で移動方法を指定します。\`new Vector(x, x)\` の部分は、最初の 1 マスの移動先を指定します。例えば、前方への移動なら \`new Vector(1, 0)\`, 右斜め前への移動なら \`new Vector(1, 1)\` となります。また、進める最大マス数の部分に \`-1\` を指定した場合、他の駒にぶつかるまでは何マスでも移動できるようになります。

最後の \`""\` で囲われた部分については \`LeaperMove\` と同様です。

#### \`MoveParallelJoint\`

上で説明した 2 つの動きを組み合わせることも可能です。次の例は、将棋の竜王の動きです。

\`\`\`js
MOVE = new MoveParallelJoint(
  new RiderMove(new Map([[new Vector(1, 0), -1]]), "oct"),
  new LeaperMove([new Vector(1, 1)], "fblr")
);
\`\`\`

## 5. 駒の初期配置

初期配置の設定例は、次の通りです。

\`\`\`js
const 初期配置を左右対称にするか = true;
const 初期配置の敵陣へのコピー = "face";
const initialPiece = new Map([
  [new Cell(0, 0), new Rook(players[0])],
  [new Cell(0, 1), new Knight(players[0])],
  [new Cell(0, 2), new Bishop(players[0])],
  [new Cell(0, 3), new King(players[0])],
  [new Cell(0, 4), new Qween(players[0])],
  [new Cell(1, 0), new Pawn(players[0])],
  [new Cell(1, 1), new Pawn(players[0])],
  [new Cell(1, 2), new Pawn(players[0])],
  [new Cell(1, 3), new Pawn(players[0])],
]);
\`\`\`

初期配置は、\`[new Cell(座標), new 駒の名前(players[0])]\` という形式のカンマ区切りで指定できます。

\`初期配置を左右対称にするか\` が \`true\` の場合、指定した初期配置が左右対称な位置にもコピーされます。ただし、既に他の駒が指定されているマスにはコピーされません(上の例では \`King\` と \`Queen\` が該当します)。コピーされないようにしたい場合は \`false\` に変更してください。

\`初期配置の敵陣へのコピー\` には、次の 3 つの文字列のうちいずれかを指定してください。

- \`face\` : 指定した初期配置が、上下対称な位置に相手の駒としてコピーされます。
- \`cross\` : 指定した初期配置が、盤面の中心について点対称な位置に相手の駒としてコピーされます。
- \`none\` : コピーされません。

\`none\` を指定した場合、後手の駒も自分で指定する必要があります。後手の駒は、\`players[0]\` を \`players[1]\` に書き換えることで指定できます。

`;

export default shogiDescription;
