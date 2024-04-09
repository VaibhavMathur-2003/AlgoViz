import React, { useState, useEffect } from "react";
import "../Styles/Path.css";
import dijkstra from "../Algos/dijkstra";
import Node from "../Visuals/Node";
import { getShortestPath, animateShortestPath } from "../Visuals/getShortestPath";
import { setInput } from "../Visuals/handleInput";
import visualizeAStar from "../Visuals/visualizeAStar";
import visualizeAlgorithm from "../Visuals/visualizeAlgorithm";



const Path = () => {
  const [grid, setGrid] = useState([]);
  const [mousePress, setmousePress] = useState(false);
  const [startRow, setStartRow] = useState(1);
  const [startCol, setStartCol] = useState(3);
  const [endRow, setendRow] = useState(4);
  const [endCol, setendCol] = useState(13);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    initializeGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportWidth]);


  const getRows = () => {
    if (viewportWidth >= 1024) {
      return 15;
    } else if (viewportWidth >= 768) {
      return 10;
    } else if (viewportWidth >= 450) {
      return 14;
    } else {
      return 10;
    }
  };

  const getColumns = () => {
    if (viewportWidth >= 1024) {
      return 43;
    } else if (viewportWidth >= 768) {
      return 30;
    } else if (viewportWidth >= 450) {
      return 25;
    } else {
      return 17;
    }
  };
  var ROWS = getRows();
  var COLS = getColumns();

  const initializeGrid = () => {
    ROWS = getRows();
    COLS = getColumns();
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
    const newGrid = WallChange(grid, row, col);
    setGrid(newGrid);
    setmousePress(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mousePress) return;
    const newGrid = WallChange(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setmousePress(false);
  };

  const WallChange = (grid, row, col) => {
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
    setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.previousNode = null;
      }
    }
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, ROWS, COLS);
    const shortestPath = getShortestPath(finishNode);
    animateDijkstra(visitedNodesInOrder, shortestPath);
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

  const reset = () => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.isWall = false;
        node.previousNode = null;
      }
    }
    setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
  };

  const setVal = (newValue, x, fn) => {
    const intValue = parseInt(newValue, 10);
    if (!isNaN(intValue) && intValue >= 0 && intValue < x) {
      fn(intValue);
    }
  };

  return (
    <div className="pathfinding">
      <h1 className="path">Path</h1>
      <div className="nodevalue">
        <div className="nodeStart">
          <label htmlFor=""> Start: </label>
          <input
            placeholder="Start Row"
            type="range"
            min="0"
            max="15"
            value={startRow}
            onChange={(e) => {
              setVal(e.target.value, ROWS, setStartRow);
              setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
            }}
          />
          <input
            placeholder="Start Column"
            type="range"
            min="0"
            max="45"
            value={startCol}
            onChange={(e) => {
              setVal(e.target.value, COLS, setStartCol);
              setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
            }}
          />
        </div>
        <div className="nodeEnd">
          <label htmlFor="">End: </label>
          <input
            placeholder="End Row"
            type="range"
            min="0"
            max="15"
            value={endRow}
            onChange={(e) => {
              setVal(e.target.value, ROWS, setendRow);
              setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
            }}
          />
          <input
            placeholder="End Column"
            type="range"
            min="0"
            max="45"
            value={endCol}
            onChange={(e) => {
              setVal(e.target.value, COLS, setendCol);
              setInput(grid, startRow, startCol, endRow, endCol, ROWS, COLS);
            }}
          />
        </div>
      </div>
      <button onClick={visualizeDijkstra}>Visualize Dijkstra's</button>
      <button onClick={() => visualizeAlgorithm("bfs", grid, startRow, startCol, endRow, endCol, ROWS, COLS)}>Visualize BFS</button>
      <button onClick={() => visualizeAlgorithm("dfs", grid, startRow, startCol, endRow, endCol, ROWS, COLS)}>Visualize DFS</button>
      <button onClick={() => visualizeAStar(grid, startRow, startCol, endRow, endCol, ROWS, COLS)}>Visualize A*</button>
      <button onClick={reset}>Reset</button>

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
