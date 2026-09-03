import { Board } from "./Board";

const board = new Board(3, 3);

board.placeSign(0, 0, "X");
board.placeSign(1, 1, "O");
board.placeSign(2, 2, "X");

console.log("Original board:");
console.dir(board.getData(), { depth: null });

console.log("\nAdd row at position 1:");
board.addRow(1);
console.dir(board.getData(), { depth: null });

console.log("\nAdd column at position 2:");
board.addColumn(2);
console.dir(board.getData(), { depth: null });

console.log("\nRemove row at position 1:");
board.removeRow(1);
console.dir(board.getData(), { depth: null });

console.log("\nRemove column at position 2:");
board.removeColumn(2);
console.dir(board.getData(), { depth: null });