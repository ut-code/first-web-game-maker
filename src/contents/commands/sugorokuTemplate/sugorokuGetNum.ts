const sugorokuGetNum = `
      //ダイスの結果を表示する関数
      function getNum(num) {
        clearTimeout(timer);
        document.getElementById("dice" + num).innerHTML = r;
        positions[num] += r;
        diceStart();
      }
`;

export default sugorokuGetNum;
