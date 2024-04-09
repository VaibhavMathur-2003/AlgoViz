const dijkstra = (grid, startNode, finishNode, ROWS, COLS) => {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) continue;

      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode === finishNode) return visitedNodesInOrder;

      updateUnvisitedNeighbors(closestNode, grid, ROWS, COLS);
    }
  };

  const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };
  const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };
  const updateUnvisitedNeighbors = (node, grid, ROWS, COLS) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, ROWS, COLS);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  const getUnvisitedNeighbors = (node, grid, ROWS, COLS) => {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  };

  export default dijkstra;