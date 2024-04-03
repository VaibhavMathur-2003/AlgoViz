import bfs from "../Algos/bfs";
import dfs from "../Algos/dfs";
import { animateAlgorithm, getShortestPath } from "./getShortestPath";
import { setInput } from "./handleInput";


const ROWS = 15;
const COLS = 45;

const visualizeAlgorithm = (algorithm, grid, startRow, startCol, endRow, endCol) => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[endRow][endCol];
    setInput(grid, startRow, startCol, endRow, endCol)
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
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      default:
        break;
    }

    const shortestPath = getShortestPath(finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };
export default visualizeAlgorithm