import { Board } from "../Board";
import { blockCellEffect } from "../cards/effects/BlockCellEffect";

const board = new Board(3, 3);

console.log(
  "Before blocking:"
);

console.log(
  board.getCell(1, 1)
);

blockCellEffect(board, 1, 1);

console.log(
  "After blocking:"
);

console.log(
  board.getCell(1, 1)
);

board.placeSign(0, 0, "X");

try {
  blockCellEffect(board, 0, 0);
} catch (error) {
  console.log(
    "Expected error:",
    (error as Error).message
  );
}

try {
  blockCellEffect(board, 1, 1);
} catch (error) {
  console.log(
    "Expected error:",
    (error as Error).message
  );
}