import { Board } from "./Board";
import { WinRule } from "./rules/WinRule";

const board = new Board(3, 3);

// board.placeSign(0, 0, "X");
// board.placeSign(0, 1, "X");
// board.placeSign(0, 2, "X");

board.placeSign(2, 0, "O");
board.placeSign(1, 1, "O");
board.placeSign(2, 2, "O");

console.dir(board.getData(), { depth: null });

const oWon = WinRule.hasWon(board, "O", 3);

console.log("Did O win?", oWon)

// const xWon = WinRule.hasWon(board, "X", 3);

// console.log("Did X win?", xWon);