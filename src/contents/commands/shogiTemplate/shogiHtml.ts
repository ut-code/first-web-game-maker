const shogiHtml = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>カスタム将棋</title>
  </head>
  <body>
    <div id="メッセージ表示" style="height: 26px"></div>
    <div id="container" style="display: flex; margin: 10px">
      <div id="後手持ち駒置き場"></div>
      <div id="盤面" style="margin: 0px 10px 0px 10px"></div>
      <div id="先手持ち駒置き場"></div>
    </div>
    <script src="./customshogi.js"></script>
    <script src="./script.js"></script>
  </body>
</html>
`;

export default shogiHtml;
