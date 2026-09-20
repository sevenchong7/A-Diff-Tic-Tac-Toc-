"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOpponentSignEffect = removeOpponentSignEffect;
function removeOpponentSignEffect(board, row, column) {
    const cell = board.getCell(row, column);
    if (cell.sign === null) {
        throw new Error("There is no sign to remove");
    }
    cell.sign = null;
}
