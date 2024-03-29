const pacmanHtml = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pacman Demo</title>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <div style="color: red">
      POINT: <span id="eaten-cookie">0</span> /
      <span id="created-cookie">0</span>
    </div>
    <div id="table"></div>
    <h2>デバッグ用</h2>
    <div id="now-direction"></div>
    <div id="next-direction"></div>
    <script src="./script.js"></script>
  </body>
</html>
`;

export default pacmanHtml;
