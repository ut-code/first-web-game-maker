const movePacman = `function movePacman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      movePacman();
    }, 10);
  }`;

export default movePacman;
