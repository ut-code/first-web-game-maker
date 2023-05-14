const sugorokuAppendHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>すごろくゲーム</title>
    <style>
      /* ゲームボードのスタイル */
      .board {
        width: 1050px;
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

      .star {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: black;
        position: absolute;
        transition: all 0.5s;
      }

      .star::after {
        content: "★";
        color: yellow;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
          <td><div id="money0"></div></td>
          <td><div id="items0">アイテム</div></td>
          <td>
            <input
              name="item00"
              type="button"
              value="1"
              onClick="itemEvent(0,0)"
            />
          </td>
          <td>
            <input
              name="item01"
              type="button"
              value="2"
              onClick="itemEvent(0,1)"
            />
          </td>
          <td>
            <input
              name="item02"
              type="button"
              value="3"
              onClick="itemEvent(0,2)"
            />
          </td>
          <td><div id="star0"></div></td>
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
          <td><div id="money1"></div></td>
          <td><div id="items1">アイテム</div></td>
          <td>
            <input
              name="item10"
              type="button"
              value="1"
              onClick="itemEvent(1,0)"
            />
          </td>
          <td>
            <input
              name="item11"
              type="button"
              value="2"
              onClick="itemEvent(1,1)"
            />
          </td>
          <td>
            <input
              name="item12"
              type="button"
              value="3"
              onClick="itemEvent(1,2)"
            />
          </td>
          <td><div id="star1"></div></td>
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
          <td><div id="money2"></div></td>
          <td><div id="items2">アイテム</div></td>
          <td>
            <input
              name="item20"
              type="button"
              value="1"
              onClick="itemEvent(2,0)"
            />
          </td>
          <td>
            <input
              name="item21"
              type="button"
              value="2"
              onClick="itemEvent(2,1)"
            />
          </td>
          <td>
            <input
              name="item22"
              type="button"
              value="3"
              onClick="itemEvent(2,2)"
            />
          </td>
          <td><div id="star2"></div></td>
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
          <td><div id="money3"></div></td>
          <td><div id="items3">アイテム</div></td>
          <td>
            <input
              name="item30"
              type="button"
              value="1"
              onClick="itemEvent(3,0)"
            />
          </td>
          <td>
            <input
              name="item31"
              type="button"
              value="2"
              onClick="itemEvent(3,1)"
            />
          </td>
          <td>
            <input
              name="item32"
              type="button"
              value="3"
              onClick="itemEvent(3,2)"
            />
          </td>
          <td><div id="star3"></div></td>
        </tr>
      </table>
    </form>

    <div class="board"></div>
    <script>
      // ゲームの定数と変数
      const BOARD_SIZE = 30;
      const CELL_SIZE = 100;
      const PLAYER_SIZE = 20;
      const STAR_SIZE = 50;
      positions = new Array(
        1,
        1,
        1,
        1,
        Math.floor(Math.random() * (BOARD_SIZE - 1)) + 2
      );
      prePositions = new Array(1, 1, 1, 1);
      money = new Array(10000, 10000, 10000, 10000);
      stars = new Array(0, 0, 0, 0);
      items = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      userNum = 0;
      preNum = 0;
      preR = 0;

      //プレイヤーの参加人数に合わせてダイスを振る処理をする関数
      function diceNext() {
        userNum++;
        if (userNum == 4) userNum = 0;
        var s = document.form1.elements["user" + userNum].value;
        if (s != "") {
          diceReset();
        } else {
          diceNext();
        }
      }

      //ダイスの結果を表示する関数
      function getNum(num) {
        clearTimeout(timer);
        document.getElementById("dice" + preNum).innerHTML = preR;
        preNum = num;
        preR = r;
        document.getElementById("dice" + num).innerHTML =
          "<font color='#FF0000'>" + r + "</font>";
        prePositions[num] = positions[num];
        positions[num] += r;
        starEvent(userNum);
        loop(userNum);
        movePlayer0();
        movePlayer1();
        movePlayer2();
        movePlayer3();
        event(userNum);
        diceNext();
      }

      //ターンプレイヤー以外にダイスを振れなくする関数
      function diceReset() {
        document.form1.button0.disabled = true;
        document.form1.button1.disabled = true;
        document.form1.button2.disabled = true;
        document.form1.button3.disabled = true;
        document.form1.elements["button" + userNum].disabled = false;
        itemButton();
        diceStart();
      }

      //ダイスを振る関数
      function diceStart() {
        r = Math.floor(Math.random() * 6) + 1;
        if (userNum != preNum || preR == 0)
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
        //スターを配置する
        const starCell = document.querySelector(
          \`.cell:nth-child(\${positions[4]})\`
        );
        const star = document.createElement("div");
        star.className = "star";
        starCell.appendChild(star);
        //初期所持金とスターを表示する
        for (i = 0; i < 4; i++) {
          document.getElementById("money" + i).innerHTML =
            "所持金:" + money[i] + "円";
          document.getElementById("star" + i).innerHTML =
            "スター" + stars[i] + "コ";
        }
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
      //スターを移動する関数
      function moveStar() {
        positions[4] = Math.floor(Math.random() * (BOARD_SIZE - 1)) + 2;
        const currentCell = document.querySelector(
          \`.cell:nth-child(\${positions[4]})\`
        );
        const star = document.querySelector(".star");
        star.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - STAR_SIZE) / 2
        }px\`;
        star.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - STAR_SIZE) / 2
        }px\`;
      }

      // ゲームを開始する関数
      function startGame() {
        movePlayer0();
        movePlayer1();
        movePlayer2();
        movePlayer3();
      }

      // ゲームを終了する関数
      function starEvent(num) {
        if (
          (prePositions[num] < positions[4]) &
          (positions[num] >= positions[4])
        ) {
          if (money[num] >= 10000) {
            getStar = confirm("10000円とスターを交換しますか?");
            if (getStar == true) {
              money[num] -= 10000;
              document.getElementById("money" + num).innerHTML =
                "所持金:" + money[num] + "円";
              stars[num] += 1;
              document.getElementById("star" + num).innerHTML =
                "スター" + stars[num] + "コ";
              moveStar();
              alert("スターを獲得しました");
            }
          } else {
            alert("スターを交換するためのお金が足りません");
          }
        }
      }

      //ランダムにイベントを発生させる関数
      function event(num) {
        if (Math.floor(Math.random() * 4) == 0) {
          income = (Math.floor(Math.random() * 10) + 1) * 1000;
          if (num == 0) {
            alert("1Pにイベント発生");
            money[0] += income;
            alert("1Pに" + income + "円追加");
            document.getElementById("money" + userNum).innerHTML =
              "所持金:" + money[0] + "円";
          }
          if (num == 1) {
            alert("2Pにイベント発生");
            money[1] += income;
            alert("2Pに" + income + "円追加");
            document.getElementById("money" + userNum).innerHTML =
              "所持金:" + money[1] + "円";
          }
          if (num == 2) {
            alert("3Pにイベント発生");
            money[2] += income;
            alert("3Pに" + income + "円追加");
            document.getElementById("money" + userNum).innerHTML =
              "所持金:" + money[2] + "円";
          }
          if (num == 3) {
            alert("4Pにイベント発生");
            money[3] += income;
            alert("4Pに" + income + "円追加");
            document.getElementById("money" + userNum).innerHTML =
              "所持金:" + money[3] + "円";
          }
        } else if (Math.floor(Math.random() * 2) == 0) {
          itemNumber = Math.floor(Math.random() * 3);
          if (num == 0) {
            alert("1Pにイベント発生");
            alert("アイテム" + (itemNumber + 1) + "を獲得");
            items[0][itemNumber] = 1;
          }
          if (num == 1) {
            alert("2Pにイベント発生");
            alert("アイテム" + (itemNumber + 1) + "を獲得");
            items[1][itemNumber] = 1;
          }
          if (num == 2) {
            alert("3Pにイベント発生");
            alert("アイテム" + (itemNumber + 1) + "を獲得");
            items[2][itemNumber] = 1;
          }
          if (num == 3) {
            alert("4Pにイベント発生");
            alert("アイテム" + (itemNumber + 1) + "を獲得");
            items[3][itemNumber] = 1;
          }
        }
      }

      function itemButton() {
        document.form1.item00.disabled = true;
        document.form1.item01.disabled = true;
        document.form1.item02.disabled = true;
        document.form1.item10.disabled = true;
        document.form1.item11.disabled = true;
        document.form1.item12.disabled = true;
        document.form1.item20.disabled = true;
        document.form1.item21.disabled = true;
        document.form1.item22.disabled = true;
        document.form1.item30.disabled = true;
        document.form1.item31.disabled = true;
        document.form1.item32.disabled = true;
        if (items[0][0] == 1) {
          document.form1.elements["item00"].disabled = false;
        }
        if (items[0][1] == 1) {
          document.form1.elements["item01"].disabled = false;
        }
        if (items[0][2] == 1) {
          document.form1.elements["item02"].disabled = false;
        }
        if (items[1][0] == 1) {
          document.form1.elements["item10"].disabled = false;
        }
        if (items[1][1] == 1) {
          document.form1.elements["item11"].disabled = false;
        }
        if (items[1][2] == 1) {
          document.form1.elements["item12"].disabled = false;
        }
        if (items[2][0] == 1) {
          document.form1.elements["item20"].disabled = false;
        }
        if (items[2][1] == 1) {
          document.form1.elements["item21"].disabled = false;
        }
        if (items[2][2] == 1) {
          document.form1.elements["item22"].disabled = false;
        }
        if (items[3][0] == 1) {
          document.form1.elements["item30"].disabled = false;
        }
        if (items[3][1] == 1) {
          document.form1.elements["item31"].disabled = false;
        }
        if (items[3][2] == 1) {
          document.form1.elements["item32"].disabled = false;
        }
      }

      //最後のマスに到達したら最初に戻す関数
      function loop(num) {
        if (positions[num] > BOARD_SIZE) {
          positions[num] = 1;
          money[num] += 10000;
          alert(
            "プレイヤー" + (userNum + 1) + "、10000円獲得、スタートに戻ります"
          );
          document.getElementById("money" + userNum).innerHTML =
            "所持金:" + money[num] + "円";
        }
      }

      function itemEvent(num, m) {
        items[num][m] = 0;
        if (m == 0) {
          alert(
            "アイテム1を使用しました、全プレイヤーがランダムに移動します。"
          );
          for (i = 0; i < 4; i++) {
            positions[i] = Math.floor(Math.random() * BOARD_SIZE) + 1;
          }
          movePlayer0();
          movePlayer1();
          movePlayer2();
          movePlayer3();
        }
        if (m == 1) {
          alert(
            "アイテム2を使用しました、全てのプレイヤーの所持金を合計し均等に分配します。"
          );
          sum = 0;
          for (i = 0; i < 4; i++) {
            sum += money[i];
          }
          for (i = 0; i < 4; i++) {
            money[i] = Math.floor(sum / 4);
            document.getElementById("money" + i).innerHTML =
              "所持金:" + money[i] + "円";
          }
        }
        if (m == 2) {
          alert(
            "アイテム3を使用しました、所持金+1万、所持金-2万、スター+1コ、スター-2コの4つのうちいずれか1つが発生します"
          );
          eventNum = Math.floor(Math.random() * 4);
          if (eventNum == 0) {
            money[num] += 10000;
            document.getElementById("money" + num).innerHTML =
              "所持金:" + money[num] + "円";
            alert("所持金+1万");
          }
          if (eventNum == 1) {
            money[num] -= 20000;
            document.getElementById("money" + num).innerHTML =
              "所持金:" + money[num] + "円";
            alert("所持金-2万");
          }
          if (eventNum == 2) {
            stars[num] += 1;
            document.getElementById("star" + num).innerHTML =
              "スター" + stars[num] + "コ";
            alert("スター+1コ");
          }
          if (eventNum == 3) {
            stars[num] -= 2;
            document.getElementById("star" + num).innerHTML =
              "スター" + stars[num] + "コ";
            alert("スター-2コ");
          }
        }
        itemButton();
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

export default sugorokuAppendHtml;
