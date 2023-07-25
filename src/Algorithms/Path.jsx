import React, { useState, useEffect } from "react";
import "../Styles/Path.css";

const ROWS = 15;
const COLS = 45;

const Node = ({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";

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

const Path = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const [startRow, setStartRow] = useState(7);
  const [startCol, setStartCol] = useState(5);
  const [endRow, setendRow] = useState(7);
  const [endCol, setendCol] = useState(35);

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
      isStart: row === startRow && col === startCol,
      isFinish: row === endRow && col === endCol,
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

  const visualizeDijkstra = () => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[endRow][endCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const shortestPath = getShortestPath(finishNode);
    animateDijkstra(visitedNodesInOrder, shortestPath);
  };

  const dijkstra = (grid, startNode, finishNode) => {
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

      updateUnvisitedNeighbors(closestNode, grid);
    }
  };
  const visualizeAlgorithm = (algorithm) => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[endRow][endCol];

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
  const getNeighbors = (node, grid) => {
    const { col, row } = node;
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
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
        const reachedFinish = dfsUtil(
          neighbor,
          visitedNodesInOrder,
          grid,
          finishNode
        );
        if (reachedFinish) {
          return true;
        }
      }
    }

    return false;
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
          element.className = "node node-visited";
        }
      }, 10 * i);
    }
  };

  const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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

  const updateUnvisitedNeighbors = (node, grid) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
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

  const animateDijkstra = (visitedNodesInOrder, shortestPath) => {
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
          element.className = "node node-visited";
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
          element.className = "node node-shortest-path";
        }
      }, 50 * i);
    }
  };
  const reset =()=>{
          // eslint-disable-next-line no-restricted-globals
          location.reload()
  }
  const setInput = ()=>{
    for (let i = 0; i <= 14; i++) {
      for (let j = 0; j <= 44; j++) {
        const element = document.getElementById(`node-${i}-${j}`);
        element.className = "node";
        
    }
  }
    const element = document.getElementById(`node-${startRow}-${startCol}`);
      if(element){
        element.className = "node node-start"
      }
    const element2 = document.getElementById(`node-${endRow}-${endCol}`);
      if(element2){
        element2.className = "node node-finish"
      }
      
  }

  return (
    <div className="pathfinding">
      <h1 className="path">Path</h1>
      <div className="nodevalue">
        <div className="nodeStart">
          <label htmlFor=""> Start: </label>
          <input
            placeholder="Start Row"
            type="number"
            value={startRow}
            onChange={(e) => {setStartRow(e.target.value)}}
          />
          <input
            placeholder="Start Column"
            type="number"
            value={startCol}
            onChange={(e) => {setStartCol(e.target.value)}}
          />
        </div>
        <div className="nodeEnd">
          <label htmlFor="">End: </label>
          <input
            placeholder="End Row"
            type="number"
            value={endRow}
            onChange={(e) => {setendRow(e.target.value) }}
          />
          <input
            placeholder="End Column"
            type="number"
            value={endCol}
            onChange={(e) => {setendCol(e.target.value)}}
          />
        </div>
        <button onClick={setInput}> Change Start/End </button>
      </div>
      <button onClick={visualizeDijkstra}>
        Visualize Dijkstra's Algorithm
      </button>
      <button onClick={() => visualizeAlgorithm("bfs")}>Visualize BFS</button>
      <button onClick={() => visualizeAlgorithm("dfs")}>Visualize DFS</button>

      <button onClick={()=>reset()}>Reset</button>

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

export default Path;
