const sugorokuDiceStart = `
      //ダイスを振る関数
      function diceStart() {
        r = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dice" + userNum).innerHTML = r;
        timer = setTimeout("diceStart()", 100);
      }
`;

export default sugorokuDiceStart;
