const sugorokuHtml = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>すごろくゲーム</title>
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
  <body>
    <h1>すごろくゲーム</h1>
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

    <div class="board"></div>

    <script>
      // ゲームの定数と変数
      const BOARD_SIZE = 25;
      const CELL_SIZE = 100;
      const PLAYER_SIZE = 20;
      const positions = new Array(1, 1, 1, 1);
      userNum = 0;

      //プレイヤーの参加人数に合わせてダイスを振る処理をする関数
      function diceNext() {
        userNum++;
        if (userNum == 4) userNum = 0;
        diceReset();
      }

      //ダイスの結果を表示する関数
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

      //ターンプレイヤー以外にダイスを振れなくする関数
      function diceReset() {
        document.form1.button0.disabled = true;
        document.form1.button1.disabled = true;
        document.form1.button2.disabled = true;
        document.form1.button3.disabled = true;
        document.form1.elements["button" + userNum].disabled = false;
        diceStart();
      }

      //ダイスを振る関数
      function diceStart() {
        r = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dice" + userNum).innerHTML = r;
        timer = setTimeout("diceStart()", 100);
      }

      // ゲームボードを作成する関数
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

      // プレイヤーを移動する関数
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

      // ゲームを開始する関数
      function startGame() {
        movePlayer0();
        movePlayer1();
        movePlayer2();
        movePlayer3();
      }

      // ゲームを初期化する関数
      function initGame() {
        createBoard();
        startGame();
        diceReset();
      }
      initGame();
    </script>
  </body>
</html>
`;

export default sugorokuHtml;
