"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
// const board = new Board(3, 3);
// console.log("Initial board:");
// console.dir(board.getData(), { depth: null });
// board.placeSign(0, 0, "X");
// board.placeSign(1, 1, "O");
// board.placeSign(0, 1, "X");
// console.log("After placing signs:");
// console.dir(board.getData(), { depth: null });
const board = new Board_1.Board(3, 3);
board.blockRow(1);
console.log("Is row 1 blocked?", board.isRowBlocked(1));
board.unblockRow(1);
console.log("Row 1 blocked after unblock:", board.isRowBlocked(1));
try {
    board.placeSign(1, 0, "X");
}
catch (error) {
    console.log("Expected error:", error.message);
}
const board2 = new Board_1.Board(3, 3);
board2.blockColumn(2);
console.log("Is column 2 blocked?", board2.isColumnBlocked(2));
board2.unblockColumn(2);
console.log("Column 2 blocked after unblock:", board2.isColumnBlocked(2));
try {
    board2.placeSign(0, 2, "X");
}
catch (error) {
    console.log("Expected error:", error.message);
}
// console.dir(board.getData(), { depth: null });
