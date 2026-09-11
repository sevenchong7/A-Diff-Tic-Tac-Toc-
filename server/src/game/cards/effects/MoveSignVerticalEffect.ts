import { Board } from "../../Board";

export function moveSignVerticalEffect(
  board: Board,
  row: number,
  column: number,
  direction: "up" | "down"
): void {
  board.moveSign(row, column, direction);
}