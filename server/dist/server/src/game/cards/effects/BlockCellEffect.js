"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockCellEffect = blockCellEffect;
function blockCellEffect(board, row, column) {
    const cell = board.getCell(row, column);
    if (cell.sign !== null) {
        throw new Error("You can only block an empty cell");
    }
    if (cell.blocked) {
        throw new Error("This cell is already blocked");
    }
    cell.blocked = true;
}
