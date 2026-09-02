import type {
  Board as BoardData,
  Cell,
  Sign,
} from "@shared/types/game";

export class Board {
  private data: BoardData;

  constructor(rows: number, columns: number) {
    this.data = {
      rows,
      columns,
      cells: [],
    };

    this.createCells();
  }

  private createCells(): void {
    for (let row = 0; row < this.data.rows; row++) {
      const currentRow: Cell[] = [];

      for (let column = 0; column < this.data.columns; column++) {
        currentRow.push({
          sign: null,
          blocked: false,
        });
      }

      this.data.cells.push(currentRow);
    }
  }

  getCell(row: number, column: number): Cell {
    if (!this.isValidPosition(row, column)) {
      throw new Error("Invalid board position");
    }

    return this.data.cells[row][column];
  }

  isValidPosition(row: number, column: number): boolean {
    return (
      row >= 0 &&
      row < this.data.rows &&
      column >= 0 &&
      column < this.data.columns
    );
  }

  placeSign(row: number, column: number, sign: Sign): void {
    if (!this.isValidPosition(row, column)) {
      throw new Error("Invalid board position");
    }

    const cell = this.data.cells[row][column];

    if (cell.sign !== null) {
      throw new Error("Cell is already occupied");
    }

    if (cell.blocked) {
      throw new Error("Cell is blocked");
    }

    cell.sign = sign;
  }

  getData(): BoardData {
    return this.data;
  }
}