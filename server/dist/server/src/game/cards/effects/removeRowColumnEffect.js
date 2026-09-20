"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRowColumnEffect = removeRowColumnEffect;
function removeRowColumnEffect(board, lineType, position) {
    if (lineType === "row") {
        board.removeRow(position);
    }
    else {
        board.removeColumn(position);
    }
}
