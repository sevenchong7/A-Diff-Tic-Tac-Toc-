import type { Board } from "../../Board";

export function removeOpponentSignEffect(
  board: Board,
  row: number,
  column: number
): void {
  const cell = board.getCell(row, column);

  if (cell.sign === null) {
    throw new Error("There is no sign to remove");
  }

  cell.sign = null;
}