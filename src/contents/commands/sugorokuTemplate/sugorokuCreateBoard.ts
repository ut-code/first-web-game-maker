const sugorokuCreateBoard = `
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
`;

export default sugorokuCreateBoard;
