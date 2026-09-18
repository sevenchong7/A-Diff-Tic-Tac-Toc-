// import { Board } from "./Board";

// const board = new Board(3, 3);

// // board.placeSign(0, 0, "X");
// // board.placeSign(0, 1, "O");
// board.placeSign(0, 2, "X");

// console.log("Before:");
// console.dir(board.getData(), { depth: null });

// console.log("Move row 0 right:");

// board.moveRowRight(0);

// console.dir(board.getData(), { depth: null });


import { Board } from "../Board";

const board = new Board(3, 3);

board.placeSign(0, 0, "X");
board.placeSign(0, 1, "O");

console.log("Before:");
console.dir(board.getData(), { depth: null });

console.log("Move row 0 left:");

board.moveRowLeft(0);

console.dir(board.getData(), { depth: null });