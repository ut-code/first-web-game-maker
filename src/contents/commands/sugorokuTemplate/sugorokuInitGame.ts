const sugorokuInitGame = `
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
`;

export default sugorokuInitGame;
