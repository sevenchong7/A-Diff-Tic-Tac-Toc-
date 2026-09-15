import { Board } from "../../Board";

export function blockCellEffect(
  board: Board,
  row: number,
  column: number
): void {
  const cell = board.getCell(row, column);

  if (cell.sign !== null) {
    throw new Error(
      "You can only block an empty cell"
    );
  }

  if (cell.blocked) {
    throw new Error(
      "This cell is already blocked"
    );
  }

  cell.blocked = true;
}