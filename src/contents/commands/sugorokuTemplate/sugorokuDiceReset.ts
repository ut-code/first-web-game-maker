const sugorokuDiceReset = `
      //ターンプレイヤー以外にダイスを振れなくする関数
      function diceReset() {
        document.form1.button0.disabled = true;
        document.form1.button1.disabled = true;
        document.form1.button2.disabled = true;
        document.form1.button3.disabled = true;
        document.form1.elements["button" + userNum].disabled = false;
        diceStart();
      }
`;

export default sugorokuDiceReset;
