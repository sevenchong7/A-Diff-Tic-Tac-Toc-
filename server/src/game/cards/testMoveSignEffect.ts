import { Board } from "../Board";
import { moveSignEffect } from "./effects/MoveSignEffect";

const board = new Board(3, 3);

board.placeSign(0, 2, "X");

console.log("Before:");
console.dir(board.getData(), { depth: null });

// moveSignEffect(board, 0, 0, "right");
moveSignEffect(board, 0, 2, "right");

console.log("After:");
console.dir(board.getData(), { depth: null });