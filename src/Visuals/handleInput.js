const setInput = (grid, startRow, startCol, endRow, endCol, ROWS, COLS) => {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const element = document.getElementById(`node-${i}-${j}`);
        if (element) {
          if (i === startRow && j === startCol) {
            element.className = "node node-start";
          } else if (i === endRow && j === endCol) {
            element.className = "node node-finish";
          } else {
            if (!grid[i][j].isWall) {
              element.className = "node";
            }
          }
        }
      }
    }
  };

  export {setInput}