const sugorokuDescription = `\
# すごろくをつくってみよう

## 定数設定

\`\`\`
  positions = new Array(1,1,1,1);
  userNum = 0;
\`\`\`

\`positions\`は各プレイヤーのすごろく上の位置を保存する為にもちいます。\`userNum\`はすごろくのターンを管理するために用います。完成すると下記のようになります。

## プレイヤーの表作成

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

4 人でプレイできるように 4x ３枠の表を作成します。各列にはプレイヤー名の入力欄、サイコロのボタン、出目を表示します。ボタンはイベント処理として、後につくる”getNum()”を呼び出すようにしてあります。以下のように表示されます。

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

## サイコロをつくる

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

## ボタンを押してサイコロを止める

\`\`\`
      function getNum(num) {
        clearTimeout(timer);
        document.getElementById("dice"+num).innerHTML = r;
        positions[num] += r;
        diceStart();
      }
\`\`\`

最初に作った各プレイヤーのボタンを押すとこの\`getnNum()\`が実行されます。\`clearTimeout(timer)\`で先ほどの無限ループを停止して、3 行目で同様にサイコロの目を出します。出た目の値をターンプレイヤーに対応する positions の値に加えましょう。処理が終了したら diceStart()に戻ります。

## ターンプレイヤー以外にダイスを振れなくする

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

## ゲームボードの作成

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

## プレイヤーの移動

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

これで表示処理ができたので先ほどのすごろくの処理に組み込みましょう。

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

## ゲームを開始する関数

\`\`\`
      function startGame() {
        movePlayer0()
        movePlayer1()
        movePlayer2()
        movePlayer3()
      }
\`\`\`

ゲームの開始時にも駒の移動をしないと駒の表示位置がかぶってしまうのでこの関数を用意しておきましょう

最後にゲームを開始するするための処理を一つにまとめて

\`\`\`
      function initGame() {
        createBoard();
        startGame();
        diceReset();
      }
    initGame();
\`\`\`

として実行しましょう。
これでいったん完成です。
`;

export default sugorokuDescription;
