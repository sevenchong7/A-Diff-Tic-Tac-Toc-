"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("./Board");
const BlockCellEffect_1 = require("./cards/effects/BlockCellEffect");
const board = new Board_1.Board(3, 3);
console.log("Before blocking:");
console.log(board.getCell(1, 1));
(0, BlockCellEffect_1.blockCellEffect)(board, 1, 1);
console.log("After blocking:");
console.log(board.getCell(1, 1));
board.placeSign(0, 0, "X");
try {
    (0, BlockCellEffect_1.blockCellEffect)(board, 0, 0);
}
catch (error) {
    console.log("Expected error:", error.message);
}
try {
    (0, BlockCellEffect_1.blockCellEffect)(board, 1, 1);
}
catch (error) {
    console.log("Expected error:", error.message);
}
