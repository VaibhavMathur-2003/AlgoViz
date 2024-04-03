import aStar from "../Algos/astar";
import { animateAlgorithm, getShortestPath } from "./getShortestPath";
import { setInput } from "./handleInput";


const ROWS = 15;
const COLS = 45;

const visualizeAStar = (grid, startRow, startCol, endRow, endCol) => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[endRow][endCol];

    setInput(grid, startRow, startCol, endRow, endCol);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = grid[row][col];
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        node.heuristic = calculateHeuristic(node, finishNode);
      }
    }

    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const shortestPath = getShortestPath(finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };
  const calculateHeuristic = (node, finishNode) => {
    return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
  };

export default visualizeAStar