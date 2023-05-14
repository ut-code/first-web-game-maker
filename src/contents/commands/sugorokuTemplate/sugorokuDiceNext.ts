const sugorokuDiceNext = `
      //プレイヤーの参加人数に合わせてダイスを振る処理をする関数
      function diceNext() {
        userNum++;
        if (userNum == 4) userNum = 0;
        diceReset();
      }
`;

export default sugorokuDiceNext;
