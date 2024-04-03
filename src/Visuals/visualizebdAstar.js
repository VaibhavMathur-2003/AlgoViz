import bdastar from "../Algos/bdastar";
import { animateAlgorithm } from "./getShortestPath";
import { setInput } from "./handleInput";

const ROWS = 15;
const COLS = 45;

const visualizebdastar = (grid, startRow, startCol, endRow, endCol) => {
  const startNode = grid[startRow][startCol];
  const finishNode = grid[endRow][endCol];

  setInput(grid, startRow, startCol, endRow, endCol);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const node = grid[row][col];
      node.isVisited = false;
      node.previousNode = null;
      node.startHeuristic = calculateHeuristic(node, startNode);
      node.finishHeuristic = calculateHeuristic(node, finishNode);
    }
  }

  const shortestPath = bdastar(grid, startNode, finishNode);
  animateAlgorithm(shortestPath);
};

const calculateHeuristic = (node, targetNode) => {
  const dx = Math.abs(node.row - targetNode.row);
  const dy = Math.abs(node.col - targetNode.col);
  return dx + dy + (1 - 2 * Math.min(dx, dy));
};

export default visualizebdastar;