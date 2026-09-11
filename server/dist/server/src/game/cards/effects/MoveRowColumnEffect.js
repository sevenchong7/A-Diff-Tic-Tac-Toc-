"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveRowColumnEffect = moveRowColumnEffect;
function moveRowColumnEffect(board, index, direction) {
    switch (direction) {
        case "left":
            board.moveRowLeft(index);
            break;
        case "right":
            board.moveRowRight(index);
            break;
        case "up":
            board.moveColumnUp(index);
            break;
        case "down":
            board.moveColumnDown(index);
            break;
    }
}
