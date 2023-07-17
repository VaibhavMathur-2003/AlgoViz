import React, { useState, useEffect } from 'react';
import "../Styles/Path.css";


const ROWS = 20;
const COLS = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

const Node = ({ row, col, isStart, isFinish, isWall, onMouseDown, onMouseEnter, onMouseUp }) => {
  const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

const PathSearch = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    initializeGrid();
}, []); // eslint-disable-line react-hooks/exhaustive-deps


  const initializeGrid = () => {
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    setGrid(grid);
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const visualizeAlgorithm = (algorithm) => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visitedNodesInOrder = [];

    switch (algorithm) {
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      default:
        break;
    }

    const shortestPath = getShortestPath(finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };

  const bfs = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    const queue = [];
    queue.push(startNode);
    startNode.isVisited = true;

    while (queue.length) {
      const currentNode = queue.shift();
      visitedNodesInOrder.push(currentNode);

      if (currentNode === finishNode) {
        return visitedNodesInOrder;
      }

      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
          queue.push(neighbor);
          neighbor.isVisited = true;
          neighbor.previousNode = currentNode;
        }
      }
    }

    return visitedNodesInOrder;
  };

  const dfs = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    dfsUtil(startNode, visitedNodesInOrder, grid, finishNode);
    return visitedNodesInOrder;
  };

  const dfsUtil = (currentNode, visitedNodesInOrder, grid, finishNode) => {
    visitedNodesInOrder.push(currentNode);
    currentNode.isVisited = true;

    if (currentNode === finishNode) {
      return true;
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = currentNode;
        const reachedFinish = dfsUtil(neighbor, visitedNodesInOrder, grid, finishNode);
        if (reachedFinish) {
          return true;
        }
      }
    }

    return false;
  };

  const getNeighbors = (node, grid) => {
    const { col, row } = node;
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const getShortestPath = (finishNode) => {
    const shortestPath = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      shortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return shortestPath;
  };

  const animateAlgorithm = (visitedNodesInOrder, shortestPath) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = 'node node-visited';
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (shortestPath) => {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  };

  return (
    <div className="pathfinding-visualizer">
      <button onClick={() => visualizeAlgorithm('bfs')}>Visualize BFS</button>
      <button onClick={() => visualizeAlgorithm('dfs')}>Visualize DFS</button>
      <div className="grid">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid-row">
              {row.map((node, nodeIndex) => {
                const { row, col, isStart, isFinish, isWall } = node;
                return (
                  <Node
                    key={nodeIndex}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PathSearch;
