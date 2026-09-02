import type { Board as BoardData, Sign } from "../../../../shared/types/game";
import { Board } from "../Board";

export class WinRule {
  static hasWon(
    board: Board,
    sign: Sign,
    winRequirement: number
  ): boolean {
    const data: BoardData = board.getData();

    // Check horizontal lines
    for (let row = 0; row < data.rows; row++) {
      for (
        let column = 0;
        column <= data.columns - winRequirement;
        column++
      ) {
        if (
          this.checkDirection(
            data,
            row,
            column,
            0,
            1,
            sign,
            winRequirement
          )
        ) {
          return true;
        }
      }
    }

    // Check vertical lines
    for (
      let row = 0;
      row <= data.rows - winRequirement;
      row++
    ) {
      for (let column = 0; column < data.columns; column++) {
        if (
          this.checkDirection(
            data,
            row,
            column,
            1,
            0,
            sign,
            winRequirement
          )
        ) {
          return true;
        }
      }
    }

    // Check diagonal: top-left → bottom-right
    for (
      let row = 0;
      row <= data.rows - winRequirement;
      row++
    ) {
      for (
        let column = 0;
        column <= data.columns - winRequirement;
        column++
      ) {
        if (
          this.checkDirection(
            data,
            row,
            column,
            1,
            1,
            sign,
            winRequirement
          )
        ) {
          return true;
        }
      }
    }

    // Check diagonal: top-right → bottom-left
    for (
      let row = 0;
      row <= data.rows - winRequirement;
      row++
    ) {
      for (
        let column = winRequirement - 1;
        column < data.columns;
        column++
      ) {
        if (
          this.checkDirection(
            data,
            row,
            column,
            1,
            -1,
            sign,
            winRequirement
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private static checkDirection(
    board: BoardData,
    startRow: number,
    startColumn: number,
    rowDirection: number,
    columnDirection: number,
    sign: Sign,
    winRequirement: number
  ): boolean {
    for (let i = 0; i < winRequirement; i++) {
      const row = startRow + i * rowDirection;
      const column = startColumn + i * columnDirection;

      const cell = board.cells[row][column];

      if (cell.sign !== sign) {
        return false;
      }
    }

    return true;
  }
}