const onKeyDown = `function onKeyDown(e) {
    if (e.keyCode === 37) {
      // west
      nextDirection = "west";
    }
    if (e.keyCode === 38) {
      // north
      nextDirection = "north";
    }
    if (e.keyCode === 39) {
      // east
      nextDirection = "east";
    }
    if (e.keyCode === 40) {
      // south
      nextDirection = "south";
    }
  }`;

const goDesignatedDirection = `  if (nextDirection === "north") {
    pacmanPositionY -= 1;
  } else if (nextDirection === "south") {
    pacmanPositionY += 1;
  } else if (nextDirection === "east") {
    pacmanPositionX += 1;
  } else if (nextDirection === "west") {
    pacmanPositionX -= 1;
  }`;

const definePacmanPositionAndNextDirection = `let pacmanPositionX = 75;
let pacmanPositionY = 75;
let nextDirection;`;

export {
  onKeyDown,
  goDesignatedDirection,
  definePacmanPositionAndNextDirection,
};
