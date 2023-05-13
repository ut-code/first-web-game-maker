const sugorokuStyle = `<!DOCTYPE html>
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
</html>
`;

export default sugorokuStyle;
