import { Board } from "./Board";

const board = new Board(3, 3);

console.log("Initial board:");
console.dir(board.getData(), { depth: null });

board.placeSign(0, 0, "X");
board.placeSign(1, 1, "O");
board.placeSign(0, 1, "X");

console.log("After placing signs:");
console.dir(board.getData(), { depth: null });