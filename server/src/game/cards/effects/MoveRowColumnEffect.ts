import { Board } from "../../Board";

export function moveRowColumnEffect(
  board: Board,
  index: number,
  direction: "left" | "right" | "up" | "down"
): void {
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