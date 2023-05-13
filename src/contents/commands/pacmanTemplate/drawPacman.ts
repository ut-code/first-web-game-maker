const drawPacman = `function drawPacman(x, y) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x, y, roadWidth / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }`;

export default drawPacman;
