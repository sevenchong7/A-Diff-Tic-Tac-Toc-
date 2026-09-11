import { Board } from "../../Board";

export function moveSignEffect(
  board: Board,
  row: number,
  column: number,
  direction: "left" | "right"
): void {
  board.moveSign(row, column, direction);
}