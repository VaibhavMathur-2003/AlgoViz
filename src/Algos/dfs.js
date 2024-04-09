import getNeighbors from "./getNeighbors";

const dfs = (grid, startNode, finishNode, ROWS, COLS) => {
    const visitedNodesInOrder = [];
    dfsUtil(startNode, visitedNodesInOrder, grid, finishNode, ROWS, COLS);
    return visitedNodesInOrder;
  };

  const dfsUtil = (currentNode, visitedNodesInOrder, grid, finishNode, ROWS, COLS) => {
    visitedNodesInOrder.push(currentNode);
    currentNode.isVisited = true;

    if (currentNode === finishNode) {
      return true;
    }

    const neighbors = getNeighbors(currentNode, grid, ROWS, COLS);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = currentNode;
        const reachedFinish = dfsUtil(
          neighbor,
          visitedNodesInOrder,
          grid,
          finishNode,
          ROWS,
          COLS
        );
        if (reachedFinish) {
          return true;
        }
      }
    }

    return false;
  };

  export default dfs;
