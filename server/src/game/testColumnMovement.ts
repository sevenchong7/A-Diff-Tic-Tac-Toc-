// import { Board } from "./Board";

// const board = new Board(3, 3);

// board.placeSign(0, 0, "X");
// board.placeSign(1, 0, "O");

// console.log("Before:");
// console.dir(board.getData(), { depth: null });

// console.log("Move column 0 up:");

// board.moveColumnUp(0);

// console.dir(board.getData(), { depth: null });

import { Board } from "./Board";

const board = new Board(3, 3);

board.placeSign(0, 0, "X");
board.placeSign(1, 0, "O");

console.log("Before:");
console.dir(board.getData(), { depth: null });

console.log("Move column 0 down:");

board.moveColumnDown(0);

console.dir(board.getData(), { depth: null });