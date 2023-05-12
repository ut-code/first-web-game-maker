const sugorokuDescription = `\
# すごろくをつくってみよう

VScode 拡張機能を用いて HTML,JavaScript でプログラムした、ブラウザで遊べる自分なりの簡単なすごろくを作ってみましょう。
level1~3 で段階的に作り方を学んでいきましょう。もちろん開発に自身がある方は飛び級しても大丈夫です。

## level1

level1 では完成済みのすごろくのコードに変更を加えて自分好みのすごろくを作ってみましょう。
\`\`\`
  positions = new Array(1,1,1,1);
  userNum = 0;
\`\`\`

\`positions\`は各プレイヤーのすごろく上の位置を保存する為にもちいます。\`userNum\`はすごろくのターンを管理するために用います。完成すると下記のようになります。

### すごろくのコードを挿入する

画面中央の New File をクリックし、ファイル名を"〇〇〇.html"(〇〇〇には好きな名前)として保存しましょう。
sugoroku.html 内部のどこかをクリックした後、画面左のすごろくタブの中にあるすごろく(全体)をクリックすると、すごろくのコードが挿入されます。
\`\`\`
    <form name="form1">
      <table border="0" cellspacing="5" cellpadding="5">
      <tr>
      <td bgColor="red"><input name="user0" type="text" size="20" value="1P"></td>
      <td><input name="button0" type="button" value="サイコロ" onClick="getNum(0)"></td>
      <td><div id="dice0"></div></td>
      </tr>
      <tr>
      <td bgColor="blue"><input name="user1" type="text" size="20" value="2P"></td>
      <td><input name="button1" type="button" value="サイコロ" onClick="getNum(1)"></td>
      <td><div id="dice1"></div></td>
      </tr>
      <tr>
      <td bgColor="green"><input name="user2" type="text" size="20" value="3P"></td>
      <td><input name="button2" type="button" value="サイコロ" onClick="getNum(2)"></td>
      <td><div id="dice2"></div></td>
      </tr>
      <tr>
      <td bgColor="yellow"><input name="user3" type="text" size="20" value="4P"></td>
      <td><input name="button3" type="button" value="サイコロ" onClick="getNum(3)"></td>
      <td><div id="dice3"></div></td>
      </tr>
      </table>
      </form>
\`\`\`

### すごろくの web ページを表示する

先ほど保存した"〇〇〇.html"の保存場所に行き、ファイルをダブルクリックすると web ページが表示されます。まずはどのようにすごろくが動作するか少し遊んでみましょう。

### すごろくのデザインを変更する

コードの一部をを変更してデザインを変えてみましょう。盤面のデザインを決定するのはほぼ\`<style>\`と\`</style>\`の間にある部分です。
左上の駒の大きさを変更したい場合は\`.player0\`の\`width: 20px\`や\`height: 20px\`の数字を書き換えれば変更できます。ただしそのままだと表示がずれるので後半の\`<script>\`
の部分の直後の\`PLAYER_SIZE\`の数字も同じにしておきましょう。
また、すごろくのマス目の色を変更したい場合には、.cell の中の\`background-color: white;\`の white を好きな色の名前に書き換えることで変更できます。
その他の部分も色や大きさは自由に変更可能です。また描画する代わりに画像を用いることもできます。

### すごろくの仕組みを変更する
\`\`\`
      function diceStart() {
        r = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dice"+userNum).innerHTML = r;
        timer = setTimeout("diceStart()",100);
      }
\`\`\`

\`Math.random()\`は 0 以上 1 未満のランダムな実数を生成、\`Math.floor()\`は少数部分を切り捨てて整数部分をとってくれます。  
\`Math.random()\`で生成した実数を６倍すると 0 以上６未満の実数が得られるので\`Math.floor()\`で少数を切り捨てて+1 すると 1,2,3,4,5,6 をランダムに出すサイコロができます。
\`document.getElementById\`は ID で指定した HTML オブジェクトを取得できます。ここでは各プレイヤーに割り当てられたサイコロの値の HTML 要素に先ほどの処理で得たサイコロの目を代入しています。
\`setTimeout(functionRef,delay)\`は\`delay\`ミリ秒経過すると処理を終了し、\`functionRef\`を実行します。よって\`setTimeout(diceReset(),100)\`は 100 ミリ秒ごとに処理を終了し\`diceReset()\`を再び実行するので 100 ミリ秒ごとにサイコロを振る処理を繰り返す無限ループを起こします。
このとき変数\`timer\`には制御用のタイマーの ID が入っており、のちに無限ループを止めるときに用います。

すごろくの仕組みを変更してみましょう。
すごろくのマス目の長さを変更したい場合は、\`const BOARD_SIZE = 5\`の数字を書き換えるすることで変更できます。
また、すごろくの出目はデフォルトでは 1~6 のランダムな数字が出ますが、これを変更したい場合は\`function diceStart()\`の内部の\`r = Math.floor(Math.random() * 6) + 1;\`の 6 を好きな数字に書き換えることで変更できます。

### 変更の反映方法
コードは書き換えた直後はブラウザ上の web ページには反映されません。Ctrl+s で変更を保存した後、ブラウザの更新ボタン(Chrome なら左上の丸矢印)を押して初めて変更されます。

## level2
\`\`\`
      function getNum(num) {
        clearTimeout(timer);
        document.getElementById("dice"+num).innerHTML = r;
        positions[num] += r;
        diceStart();
      }
\`\`\`

最初に作った各プレイヤーのボタンを押すとこの\`getnNum()\`が実行されます。\`clearTimeout(timer)\`で先ほどの無限ループを停止して、3 行目で同様にサイコロの目を出します。出た目の値をターンプレイヤーに対応する positions の値に加えましょう。処理が終了したら diceStart()に戻ります。

level2 ではすごろくのコードを部分ごとに理解しながら、自分ですごろくを作ってみましょう。基本的には画面左側に表示されているそれぞれのボタンを押して部分ごとにコードを挿入していくことで、すごろくを作っていきますが自分で一部を書き加えたり、コードを整理したりする必要が出てきます。また、コードはボタンを押したときのカーソル位置に挿入されていくので挿入時はカーソル位置に気をつけましょう。以降の見出しになっている部分はそれぞれボタンを押すと挿入されるコードの説明になっています。

### style

\`\`\`html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>すごろくゲーム</title>
    <style>
\`\`\`
      function diceReset() {
        document.form1.button0.disabled = true;
        document.form1.button1.disabled = true;
        document.form1.button2.disabled = true;
        document.form1.button3.disabled = true;
        document.form1.elements["button"+userNum].disabled = false;
        diceStart();
      }
\`\`\`

現在の状態では一人のプレイヤーしかサイコロを振れません。ターンプレイヤー以外はサイコロが振れないようにしてサイコロボタンが押されたらターンが切り替わるようにしましょう。
\`document.form1.button0.disabled = true\`とすることで使用不可にできます。まず全プレイヤーのボタンを使用不可にした後、ターンが回ってきている(\`userNum\`に対応する)プレイヤーだけ\`.disabled = false\`としましょう。ターンプレイヤーが決まったら\`diceStart()\`します。ターン終了後に userNum を操作するのはこの後の diceNext()でやります。

## ターンの切り替え

\`\`\`
      function diceNext() {
        userNum++;
        if (userNum == 4) userNum = 0;
        diceReset();
      }
\`\`\`

サイコロの出目を表示したらターンを切り替えましょう。出目の処理後、ターンを管理している userNum に 1 を足します。ただしプレイヤーは 0 から 3 の４人のため userNum が４になったら if 文をもちいて０に戻してあげましょう。最後に diceReset をもちいてターンプレイヤーを切り替えます。

getNum の 5 行目をを修正して

\`\`\`
     function getNum(num) {
        clearTimeout(timer);
        document.getElementById("dice"+num).innerHTML = r;
        positions[num] += r;
        diceNext();
      }
\`\`\`

としたらすごろくの処理は完成です。

処理の流れとしては

diceReset でターンプレイヤーを決める →diceStart でサイコロが回りつつづける →(ボタンを押す)→getNum でサイコロの出目が決まり、その値だけ positions が増加 →diceNext でターンが切り替わる →diceReset→…

となっています。

# すごろくを表示する

それではここから HTML と CSS をもちいて web ページ上にすごろくを表示していきましょう。

## ゲームボードとプレイヤーのスタイル及び定数

\`\`\`
<style>
      /* ゲームボードのスタイル */
      .board {
        width: 550px;
        height: 550px;
        border: 0px;
        display: flex;
        flex-wrap: wrap;
      }
      .cell {
        width: 100px;
        height: 100px;
        border: 1px solid black;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      /* プレイヤーのスタイル */
      .player0 {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        transition: all 0.5s;
      }
      .player1 {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: blue;
        position: absolute;
        transition: all 0.5s;
      }
      .player2 {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: green;
        position: absolute;
        transition: all 0.5s;
      }
      .player3 {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: yellow;
        position: absolute;
        transition: all 0.5s;
      }
    </style>
  </head>
</html>
\`\`\`

\`<style>\`ではすごろくのマス目とプレイヤーの駒のデザインを決定しています。これらを変更すれば自由にデザインの変更が可能です。
\`Player\` の\`position: absolute\`を忘れないこととこの後の settings を挿入した際にあらわれる\`CELL_SIZE\`と\`PLAYER_SIZE\`の値をここで用いた値と一致させること以外は適当に変更しても動くので大丈夫です。

### table

\`\`\`js
<body>
  <form name="form1">
    <table border="0" cellspacing="5" cellpadding="5">
      <tr>
        <td bgcolor="red">
          <input name="user0" type="text" size="20" value="1P" />
        </td>
        <td>
          <input
            name="button0"
            type="button"
            value="サイコロ"
            onClick="getNum(0)"
          />
        </td>
        <td>
          <div id="dice0"></div>
        </td>
      </tr>
      <tr>
        <td bgcolor="blue">
          <input name="user1" type="text" size="20" value="2P" />
        </td>
        <td>
          <input
            name="button1"
            type="button"
            value="サイコロ"
            onClick="getNum(1)"
          />
        </td>
        <td>
          <div id="dice1"></div>
        </td>
      </tr>
      <tr>
        <td bgcolor="green">
          <input name="user2" type="text" size="20" value="3P" />
        </td>
        <td>
          <input
            name="button2"
            type="button"
            value="サイコロ"
            onClick="getNum(2)"
          />
        </td>
        <td>
          <div id="dice2"></div>
        </td>
      </tr>
      <tr>
        <td bgcolor="yellow">
          <input name="user3" type="text" size="20" value="4P" />
        </td>
        <td>
          <input
            name="button3"
            type="button"
            value="サイコロ"
            onClick="getNum(3)"
          />
        </td>
        <td>
          <div id="dice3"></div>
        </td>
      </tr>
    </table>
  </form>
</body>
\`\`\`

style を挿入するときは\`<head>\`と\`</head>\`の間に挿入しましょう。ここでは 4 人でプレイできるように必要な情報を表示する 4x3 枠の表を作成しています。各列にはプレイヤー名の入力欄、サイコロのボタン、出目が表示されます。ボタンは押したときのイベント処理として、後につくる”getNum()”を呼び出すようにしてあります。完成すると以下のように表示されます。

<form name="form1">
  <table border="0" cellspacing="5" cellpadding="5">
    <tr>
      <td bgcolor="red">
        <input name="user0" type="text" size="20" value="1P" />
      </td>
      <td>
        <input
          name="button0"
          type="button"
          value="サイコロ"
          onClick="getNum(0)"
        />
      </td>
      <td><div id="dice0"></div></td>
    </tr>
    <tr>
      <td bgcolor="blue">
        <input name="user1" type="text" size="20" value="2P" />
      </td>
      <td>
        <input
           name="button1"
          type="button"
          value="サイコロ"
          onClick="getNum(1)"
        />
          </td>
      <td><div id="dice1"></div></td>
     </tr>
    <tr>
      <td bgcolor="green">
        <input name="user2" type="text" size="20" value="3P" />
      </td>
      <td>
        <input
          name="button2"
          type="button"
          value="サイコロ"
          onClick="getNum(2)"
        />
      </td>
      <td><div id="dice2"></div></td>
    </tr>
    <tr>
      <td bgcolor="yellow">
        <input name="user3" type="text" size="20" value="4P" />
      </td>
      <td>
        <input
          name="button3"
          type="button"
          value="サイコロ"
          onClick="getNum(3)"
        />
      </td>
      <td><div id="dice3"></div></td>
    </tr>
  </table>
</form>

### 見出しを挿入

\`\`\`js
<h1>すごろくゲーム</h1>
\`\`\`

見出しを挿入するときは\`<body>\`と\`<form name="form1">\`の間に挿入しましょう。この部分はなくても全体の処理に問題はないです。

### 箱を挿入

\`\`\`js
<div class="board" id="board"></div>
\`\`\`

箱を挿入するときは\`</form>\`と\`</body>\`の間に挿入しましょう。ここでは後にすごろくのマス目を表示する箱を作成しています。ボタンを押すと"id"を命名するように言われるので"board"と入力しましょう。その後自ら\`class="board"\`と書き加えましょう
\`\`\`

\`\`\`
      const BOARD_SIZE = 5;
      const CELL_SIZE = 100;
      const PLAYER_SIZE = 20;
      const GOAL = BOARD_SIZE * BOARD_SIZE;
      positions = new Array(1,1,1,1);
      userNum = 0;
\`\`\`

\`<style>\`ではすごろくのマス目とプレイヤーの駒のデザインを決定しています。これらを変更すれば自由にデザインの変更が可能です。
\`Player\` の\`position: absolute\`を忘れないことと\`CELL_SIZE\`と\`PLAYER_SIZE\`の値を\`<style>\`で用いた値と一致させること以外は適当に変更しても動くので大丈夫です。

### settings

\`\`\`html
<script>
  // ゲームの定数と変数
  const BOARD_SIZE = 25;
  const CELL_SIZE = 100;
  const PLAYER_SIZE = 20;
  const positions = new Array(1, 1, 1, 1);
  userNum = 0;
</script>
\`\`\`

settings を挿入するときは\`</body>\`の前に挿入するようにしましょう。ここではすごろくの定数と変数を定義しています。
それぞれの値は以下のような意味を持ちます。
\`BOARD_SIZE\` すごろくのマス目の数
\`CELL_SIZE\` すごろくのマス目の大きさ
\`PLAYER_SIZE\` プレイヤーの駒の大きさ
\`positions\` 各プレイヤーのすごろく上の位置
\`userNum\` 現在ののターンプレイヤー

### diceStart

\`\`\`js
function diceStart() {
  r = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice" + userNum).innerHTML = r;
  timer = setTimeout("diceStart()", 100);
}
\`\`\`

diceStart を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではサイコロを振る処理を定義しています。
\`Math.random()\`は 0 以上 1 未満のランダムな実数を生成、\`Math.floor()\`は少数部分を切り捨てて整数部分をとってくれます。  
\`Math.random()\`で生成した実数を６倍すると 0 以上６未満の実数が得られるので\`Math.floor()\`で少数を切り捨てて+1 すると 1,2,3,4,5,6 をランダムに出すサイコロができます。
\`document.getElementById\`は ID で指定した HTML オブジェクトを取得できます。ここでは各プレイヤーに割り当てられたサイコロの値(table で作った表の値)に先ほどの処理で得たサイコロの目を代入しています。
\`setTimeout(functionRef,delay)\`は\`delay\`ミリ秒経過すると処理を終了し、\`functionRef\`を実行します。よって\`setTimeout(diceStart(),100)\`は 100 ミリ秒ごとに処理を終了し\`diceStart()\`を再び実行するので 100 ミリ秒ごとにサイコロを振る処理を繰り返す無限ループを起こします。
このとき変数\`timer\`には制御用のタイマーの ID が入っており、のちに無限ループを止めるときに用います。

### getNum
\`\`\`
      function createBoard() {
        const board = document.querySelector('.board');
        for (let i = 0; i < GOAL; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.innerText = i + 1;
          board.appendChild(cell);
        }
        const startCell = document.querySelector('.cell');
        const player0 = document.createElement('div');
        player0.className = 'player0';
        startCell.appendChild(player0);
        const player1 = document.createElement('div');
        player1.className = 'player1';
        startCell.appendChild(player1);
        const player2 = document.createElement('div');
        player2.className = 'player2';
        startCell.appendChild(player2);
        const player3 = document.createElement('div');
        player3.className = 'player3';
        startCell.appendChild(player3);
      }
\`\`\`

\`document.querySelector(selectors)\`は\`selecors\`に一致するものを探し出して HTML 要素にしてくれます。\`document.createElement(tagName)\`は\`tagName\`で指定された HTML 要素を作り出してくれます。

ここでは２行目で\`const board = document.querySelector('.board');\`で.board を HTML 要素としてゲームボードを作成します。4 行目\`const cell = document.createElement('div')\`で div タグの空の HTML 要素をつくり５行目で内部に数字を入れて 6 行目の\`board.appendChild(cell)\`で\`cell\`を\`board\`の子要素として表示することで、数字入りのマス目ができます。あとは For 文でゴールまでのマス目分繰り返しましょう。
後は同様に各プレイヤーを\`startCell\`の子要素としてボードに配置していきましょう。

\`\`\`js
function getNum(num) {
  clearTimeout(timer);
  document.getElementById("dice" + num).innerHTML = r;
  positions[num] += r;
  diceStart();
}
\`\`\`

getNum を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではサイコロの出目を決定する処理を定義しています。
最初に作った各プレイヤーのボタンを押すとこの\`getNum()\`が実行されます。\`clearTimeout(timer)\`で先ほどの無限ループを停止して、3 行目で同様にサイコロの目を出します。出た目の値をターンプレイヤーに対応する positions の値に加えましょう。処理が終了したら diceStart()に戻ります。

### diceReset

\`\`\`js
function diceReset() {
  document.form1.button0.disabled = true;
  document.form1.button1.disabled = true;
  document.form1.button2.disabled = true;
  document.form1.button3.disabled = true;
  document.form1.elements["button" + userNum].disabled = false;
  diceStart();
}
\`\`\`

diceReset を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではサイコロを振るプレイヤーを決める処理を定義しています。
現在の状態では最初のプレイヤーしかサイコロを振れません。次に挿入する\`diceNext\`と合わせて、サイコロボタンが押されたらターンが切り替わり、ターンプレイヤー以外はサイコロが振れないようにしましょう。
\`document.form1.button0.disabled = true\`とすることでボタンを使用不可にできます。まず全プレイヤーのボタンを使用不可にした後、ターンが回ってきている(\`userNum\`に対応する)プレイヤーだけ\`.disabled = false\`としましょう。ターンプレイヤーが決まったら\`diceStart()\`します。ターン終了後に userNum を操作するのはこの後の diceNext()でやります。

### diceNext()

\`\`\`js
function diceNext() {
  userNum++;
  if (userNum == 4) userNum = 0;
  diceReset();
}
\`\`\`

diceNext を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではターンプレイヤーを切り替える処理を定義しています。
出目の処理後、ターンを管理している userNum に 1 を足します。ただしプレイヤーは 0 から 3 の４人のため userNum が４になったら if 文をもちいて０に戻してあげましょう。最後に diceReset をもちいてターンプレイヤーを切り替えます。
\`\`\`
      function movePlayer0() {
        const currentCell = document.querySelector(\`.cell:nth-child(\${
          positions[0]
        })\`);
        const player0 = document.querySelector('.player0');
        player0.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
        player0.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
      }
      function movePlayer1() {
        const currentCell = document.querySelector(\`.cell:nth-child(\${
          positions[1]
        })\`);
        const player1 = document.querySelector('.player1');
        player1.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
        player1.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
      }
      function movePlayer2() {
        const currentCell = document.querySelector(\`.cell:nth-child(\${
          positions[2]
        })\`);
        const player2 = document.querySelector('.player2');
        player2.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
        player2.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
      }
      function movePlayer3() {
        const currentCell = document.querySelector(\`.cell:nth-child(\${
          positions[3]
        })\`);
        const player3 = document.querySelector('.player3');
        player3.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
        player3.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
      }
\`\`\`

２行目の\`.cell:nth-child(\${
  positions[0]
})\`はさきほど作ったセルのうち\`position[0]\`番目(プレイヤー 0 の現在地)を指定しています。３行目では CSS の\`.player0\`を指定してプレイヤーの駒を表示しています。4,5 行目では HTML 上の駒の位置にあたる\`player0.style.top\`(上端からの距離), \`player0.style.left\`(左端からの距離)を変更して、先ほどの\`currentCell\`に駒を移動しています。\`currentCell\`との相対位置を用いて駒の位置がマスの中央にくるようにしたあと最後にわずかに位置をずらしてそれぞれのプレイヤーの駒がかぶらないようにしています。

先ほどの\`getNum()\`は終了後に\`diceStart()\`に戻るので 5 行目を修正して diceNext()に行くように書き換えましょう。

\`\`\`js
function getNum(num) {
  clearTimeout(timer);
  document.getElementById("dice" + num).innerHTML = r;
  positions[num] += r;
  diceNext();
}
\`\`\`

としたらすごろくの処理は完成です。

処理の流れとしては

\`diceReset()\`でターンプレイヤーを決める →\`diceStart()\`でサイコロが回りつつづける →(ボタンを押す)→\`getNum()\`でサイコロの出目が決まり、その値だけ\`positions\`が増加 →\`diceNext()\` でターンが切り替わる(user_num が変化) →\`diceReset()\`→…

となっています。

### createBoard

\`\`\`js
function createBoard() {
  const board = document.querySelector(".board");
  for (let i = 0; i < BOARD_SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i + 1;
    board.appendChild(cell);
  }
  // プレイヤーを初期位置に配置する
  const startCell = document.querySelector(".cell");
  const player0 = document.createElement("div");
  player0.className = "player0";
  startCell.appendChild(player0);
  const player1 = document.createElement("div");
  player1.className = "player1";
  startCell.appendChild(player1);
  const player2 = document.createElement("div");
  player2.className = "player2";
  startCell.appendChild(player2);
  const player3 = document.createElement("div");
  player3.className = "player3";
  startCell.appendChild(player3);
}
\`\`\`
\`\`\`
      function getNum(num) {
      clearTimeout(timer);
        document.getElementById("dice"+num).innerHTML = r;
        positions[num] += r;
        movePlayer0();
        movePlayer1();
        movePlayer2();
        movePlayer3();
        diceNext();
      }
\`\`\`

ここからはすごろくの盤面を作成していきましょう。
createBoard を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではすごろくのマス目を表示する処理とプレイヤーを初期位置に表示する処理を定義しています。
\`document.querySelector(selectors)\`は\`selectors\`に一致するものを探し出して HTML 要素にしてくれます\`document.createElement(tagName)\`は\`tagName\`で指定された HTML 要素を作り出してくれます。

ここでは２行目で\`const board = document.querySelector('.board');\`で.board を HTML 要素としてゲームボードを作成します。4 行目\`const cell = document.createElement('div')\`で div タグの空の HTML 要素をつくり５行目で内部に数字を入れて 6 行目の\`board.appendChild(cell)\`で\`cell\`を\`board\`の子要素として表示することで、数字入りのマス目ができます。あとは For 文でゴールまでのマス目分繰り返しましょう。
後は同様に各プレイヤーを\`startCell\`の子要素としてボードに配置していきましょう。

### movePlayer

\`\`\`js
function movePlayer0() {
  const currentCell = document.querySelector(
    \`.cell:nth-child(\${positions[0]})\`
  );
  const player0 = document.querySelector(".player0");
  player0.style.top = \`\${
    currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
  }px\`;
  player0.style.left = \`\${
    currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
  }px\`;
}
function movePlayer1() {
  const currentCell = document.querySelector(
    \`.cell:nth-child(\${positions[1]})\`
  );
  const player1 = document.querySelector(".player1");
  player1.style.top = \`\${
    currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
  }px\`;
  player1.style.left = \`\${
    currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
  }px\`;
}
function movePlayer2() {
  const currentCell = document.querySelector(
    \`.cell:nth-child(\${positions[2]})\`
  );
  const player2 = document.querySelector(".player2");
  player2.style.top = \`\${
    currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
  }px\`;
  player2.style.left = \`\${
    currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
  }px\`;
}
function movePlayer3() {
  const currentCell = document.querySelector(
    \`.cell:nth-child(\${positions[3]})\`
  );
  const player3 = document.querySelector(".player3");
  player3.style.top = \`\${
    currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
  }px\`;
  player3.style.left = \`\${
    currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
  }px\`;
}
\`\`\`

movePlayer を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではそれぞれの駒を移動し、表示する処理を定義しています。
3 行目の\`.cell:nth-child(\${positions[0]})\`はさきほど作ったセルのうち\`position[0]\`番目(プレイヤー 0 の現在地)を指定しています。5 行目では CSS の\`.player0\`を指定してプレイヤーの駒を表示しています。6~11 行目では HTML 上の駒の位置にあたる\`player0.style.top\`(上端からの距離), \`player0.style.left\`(左端からの距離)を変更して、先ほどの\`currentCell\`に駒を移動しています。\`currentCell\`との相対位置を用いて駒の位置がマスの中央にくるようにしたあと、最後にわずかに位置をずらしてそれぞれのプレイヤーの駒がかぶらないようにしています。

これで表示処理ができたので先ほどのすごろくの処理に組み込みましょう。

\`\`\`js
function getNum(num) {
  clearTimeout(timer);
  document.getElementById("dice" + num).innerHTML = r;
  positions[num] += r;
  movePlayer0();
  movePlayer1();
  movePlayer2();
  movePlayer3();
  diceNext();
}
\`\`\`

\`\`\`
      function startGame() {
        movePlayer0()
        movePlayer1()
        movePlayer2()
        movePlayer3()
      }
\`\`\`

\`getNum()\`に\`movePlayer\`を挿入して\`positions\`が更新されたら移動の処理が行われるようにしましょう。これで表示のための処理もほぼ完成です。

### initGame

\`\`\`js
function startGame() {
  movePlayer0();
  movePlayer1();
  movePlayer2();
  movePlayer3();
}
\`\`\`

initGame を挿入するときは\`</script>\`の前に挿入するようにしましょう。ここではゲーム開始時の処理を定義し実行しています。
\`startGame()\`はゲームの開始時に駒の移動をするための処理を定義しています。こうしないと駒の表示位置がかぶってしまうのでこの関数を用意しておきましょう。

最後にゲームを開始するための処理を一つにまとめて

\`\`\`js
function initGame() {
  createBoard();
  startGame();
  diceReset();
}
initGame();
\`\`\`

\`initGame()\`として、最後に\`initGame()\`を実行しましょう。
これで完成です。

## level3(発展)

ここからは今までに作ったすごろくに変化を加えたり新たな要素を追加して完全オリジナルなすごろくを作っていきましょう。以下にすごろくに追加する要素、変更点の例をいくつか挙げておきます。

### 処理の問題の修正

- 現在の状態だと\`position\`がゴールを超えると処理が止まってしまいます。これを修正してゴールしたらゲームが終了するようにしてみましょう。 -現在は 4 人のプレイヤーがプレイする前提ですごろくが作られていますが、1~4 人のどの人数でもプレイできるようにしてみましょう。

### 発展

-サイコロを振るとランダムにイベントが発生するようにしてみましょう。 -所持金などの新たな概念をすごろくに取り入れてみましょう。 -アイテムの概念を追加し各プレイヤーが使えるようにしてみましょう。

### おまけ

すごろく(追加版)を押すと様々な要素が追加されたすごろくで遊べます。ぜひ参考にしてオリジナルのすごろくを作ってみてください。
`;

export default sugorokuDescription;
