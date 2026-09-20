import type { Board } from "../../Board";

export function removeRowColumnEffect(
  board: Board,
  lineType: "row" | "column",
  position: number
): void {
  if (lineType === "row") {
    board.removeRow(position);
  } else {
    board.removeColumn(position);
  }
}