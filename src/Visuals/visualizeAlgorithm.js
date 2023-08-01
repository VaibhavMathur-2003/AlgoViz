// import bfs from "../Algos/bfs";
// import dfs from "../Algos/dfs";
// import getShortestPath from "./getShortestPath";

// const visualizeAlgorithm = (algorithm) => {
//     const startNode = grid[startRow][startCol];
//     const finishNode = grid[endRow][endCol];

//     let visitedNodesInOrder = [];

//     switch (algorithm) {
//       case "bfs":
//         visitedNodesInOrder = bfs(grid, startNode, finishNode);
//         break;
//       case "dfs":
//         visitedNodesInOrder = dfs(grid, startNode, finishNode);
//         break;
//       default:
//         break;
//     }

//     const shortestPath = getShortestPath(finishNode);
//     animateAlgorithm(visitedNodesInOrder, shortestPath);
//   };

//   const animateAlgorithm = (visitedNodesInOrder, shortestPath) => {
//     for (let i = 0; i <= visitedNodesInOrder.length; i++) {
//       if (i === visitedNodesInOrder.length) {
//         setTimeout(() => {
//           animateShortestPath(shortestPath);
//         }, 10 * i);
//         return;
//       }
//       setTimeout(() => {
//         const node = visitedNodesInOrder[i];
//         const element = document.getElementById(`node-${node.row}-${node.col}`);
//         if (element) {
//           element.className = "node node-visited";
//         }
//       }, 10 * i);
//     }
//   };

//   const animateShortestPath = (shortestPath) => {
//     for (let i = 0; i < shortestPath.length; i++) {
//       setTimeout(() => {
//         const node = shortestPath[i];
//         const element = document.getElementById(`node-${node.row}-${node.col}`);
//         if (element) {
//           element.className = "node node-shortest-path";
//         }
//       }, 50 * i);
//     }
//   };

//   export default visualizeAlgorithm

