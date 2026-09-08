import { Board } from "./Board";

const board = new Board(3, 3);

// Place X and O
board.placeSign(0, 0, "X");
board.placeSign(0, 1, "O");

console.dir(board.getData(), { depth: null });


// Test 1: Move X right
console.log("Move X right");

board.moveSign(0, 0, "right");

console.dir(board.getData(), { depth: null });


// Test 2: Move X right again
console.log("Move X right again");

board.moveSign(0, 1, "right");

console.dir(board.getData(), { depth: null });


// Test 3: Move X left
console.log("Move X left");

board.moveSign(0, 2, "left");

console.dir(board.getData(), { depth: null });


// Test 4: Move X up
console.log("Move X up");

board.moveSign(0, 1, "up");

console.dir(board.getData(), { depth: null });