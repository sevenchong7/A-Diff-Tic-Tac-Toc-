import type {
  Board as BoardData,
  Cell,
  Sign,
} from "@shared/types/game";
import {
  MIN_BOARD_ROWS,
  MAX_BOARD_ROWS,
  MIN_BOARD_COLUMNS,
  MAX_BOARD_COLUMNS,
} from "./constants";

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

  public addRow(position: number): void {
    if (this.data.rows >= MAX_BOARD_ROWS) {
      throw new Error("Maximum number of rows reached");
    }

    if (position < 0 || position > this.data.rows) {
      throw new Error("Invalid row insertion position");
    }

    const newRow: Cell[] = [];

    for (let column = 0; column < this.data.columns; column++) {
      newRow.push({
        sign: null,
        blocked: false,
      });
    }

    this.data.cells.splice(position, 0, newRow);

    this.data.rows++;
  }

  public addColumn(position: number): void {
    if (this.data.columns >= MAX_BOARD_COLUMNS) {
      throw new Error("Maximum number of columns reached");
    }

    if (position < 0 || position > this.data.columns) {
      throw new Error("Invalid column insertion position");
    }

    for (const row of this.data.cells) {
      row.splice(position, 0, {
        sign: null,
        blocked: false,
      });
    }

    this.data.columns++;
  }

  public removeRow(position: number): void {
    if (this.data.rows <= MIN_BOARD_ROWS) {
      throw new Error("Cannot remove row below minimum board size");
    }

    if (position < 0 || position >= this.data.rows) {
      throw new Error("Invalid row removal position");
    }

    this.data.cells.splice(position, 1);

    this.data.rows--;
  }

  public removeColumn(position: number): void {
    if (this.data.columns <= MIN_BOARD_COLUMNS) {
      throw new Error("Cannot remove column below minimum board size");
    }

    if (position < 0 || position >= this.data.columns) {
      throw new Error("Invalid column removal position");
    }

    for (const row of this.data.cells) {
      row.splice(position, 1);
    }

    this.data.columns--;
  }

  getData(): BoardData {
    return this.data;
  }
}