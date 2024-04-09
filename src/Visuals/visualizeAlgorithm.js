import bfs from "../Algos/bfs";
import dfs from "../Algos/dfs";
import { animateAlgorithm, getShortestPath } from "./getShortestPath";
import { setInput } from "./handleInput";


const visualizeAlgorithm = (algorithm, grid, startRow, startCol, endRow, endCol, ROWS, COLS) => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[endRow][endCol];
    setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS)
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.previousNode = null;
      }
    }

    let visitedNodesInOrder = [];

    switch (algorithm) {
      case "bfs":
        visitedNodesInOrder = bfs(grid, startNode, finishNode, ROWS, COLS);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid, startNode, finishNode, ROWS, COLS);
        break;
      default:
        break;
    }

    const shortestPath = getShortestPath(finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };
export default visualizeAlgorithm