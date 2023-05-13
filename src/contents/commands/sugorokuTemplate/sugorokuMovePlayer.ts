const sugorokuMovePlayer = `
      // プレイヤーを移動する関数
      function movePlayer0() {
        const currentCell = document.querySelector(
          \`.cell:nth-child(\${positions[0]})\`
        );
        const player0 = document.querySelector(".player0");
        player0.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
        player0.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
      }
      function movePlayer1() {
        const currentCell = document.querySelector(
          \`.cell:nth-child(\${positions[1]})\`
        );
        const player1 = document.querySelector(".player1");
        player1.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
        player1.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
      }
      function movePlayer2() {
        const currentCell = document.querySelector(
          \`.cell:nth-child(\${positions[2]})\`
        );
        const player2 = document.querySelector(".player2");
        player2.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
        player2.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 - 20
        }px\`;
      }
      function movePlayer3() {
        const currentCell = document.querySelector(
          \`.cell:nth-child(\${positions[3]})\`
        );
        const player3 = document.querySelector(".player3");
        player3.style.top = \`\${
          currentCell.offsetTop + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
        player3.style.left = \`\${
          currentCell.offsetLeft + (CELL_SIZE - PLAYER_SIZE) / 2 + 20
        }px\`;
      }
`;

export default sugorokuMovePlayer;
