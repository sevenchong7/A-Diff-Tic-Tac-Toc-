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

  private blockedRows: Set<number>;
  private blockedColumns: Set<number>;

  constructor(rows: number, columns: number) {
    this.data = {
      rows,
      columns,
      cells: [],
    };

    this.blockedRows = new Set();
    this.blockedColumns = new Set();

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

    if (cell.sign !== null) {
      throw new Error("Cell is already occupied");
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

  public moveSign(
    row: number,
    column: number,
    direction: "up" | "down" | "left" | "right"
  ): void {
    if (!this.isValidPosition(row, column)) {
      throw new Error("Invalid board position");
    }

    const sourceCell = this.data.cells[row][column];

    if (sourceCell.sign === null) {
      throw new Error("There is no sign to move");
    }

    let targetRow = row;
    let targetColumn = column;

    switch (direction) {
      case "up":
        targetRow =
          (row - 1 + this.data.rows) % this.data.rows;
        break;

      case "down":
        targetRow =
          (row + 1) % this.data.rows;
        break;

      case "left":
        targetColumn =
          (column - 1 + this.data.columns) %
          this.data.columns;
        break;

      case "right":
        targetColumn =
          (column + 1) % this.data.columns;
        break;
    }

    const targetCell =
      this.data.cells[targetRow][targetColumn];

    // Swap the signs
    const tempSign = sourceCell.sign;

    sourceCell.sign = targetCell.sign;
    targetCell.sign = tempSign;
  }

  public moveRowRight(row: number): void {
    if (row < 0 || row >= this.data.rows) {
      throw new Error("Invalid row");
    }

    const currentRow = this.data.cells[row];

    const lastCell = currentRow[currentRow.length - 1];

    for (let column = currentRow.length - 1; column > 0; column--) {
      currentRow[column] = currentRow[column - 1];
    }

    currentRow[0] = lastCell;
  }

  public moveRowLeft(row: number): void {
    if (row < 0 || row >= this.data.rows) {
      throw new Error("Invalid row");
    }

    const currentRow = this.data.cells[row];

    const firstCell = currentRow[0];

    for (let column = 0; column < currentRow.length - 1; column++) {
      currentRow[column] = currentRow[column + 1];
    }

    currentRow[currentRow.length - 1] = firstCell;
  }

  public moveColumnUp(column: number): void {
    if (column < 0 || column >= this.data.columns) {
      throw new Error("Invalid column");
    }

    const firstCell = this.data.cells[0][column];

    for (let row = 0; row < this.data.rows - 1; row++) {
      this.data.cells[row][column] =
        this.data.cells[row + 1][column];
    }

    this.data.cells[this.data.rows - 1][column] = firstCell;
  }


  public moveColumnDown(column: number): void {
    if (column < 0 || column >= this.data.columns) {
      throw new Error("Invalid column");
    }

    const currentColumnBottom =
      this.data.cells[this.data.rows - 1][column];

    for (let row = this.data.rows - 1; row > 0; row--) {
      this.data.cells[row][column] =
        this.data.cells[row - 1][column];
    }

    this.data.cells[0][column] = currentColumnBottom;
  }

  getData(): BoardData {
    return this.data;
  }

  public blockRow(row: number): void {
    if (row < 0 || row >= this.data.rows) {
      throw new Error("Invalid row");
    }

    this.blockedRows.add(row);
  }

  public blockColumn(column: number): void {
    if (column < 0 || column >= this.data.columns) {
      throw new Error("Invalid column");
    }

    this.blockedColumns.add(column);
  }

  public isRowBlocked(row: number): boolean {
    if (row < 0 || row >= this.data.rows) {
      throw new Error("Invalid row");
    }

    return this.blockedRows.has(row);
  }

  public isColumnBlocked(column: number): boolean {
    if (column < 0 || column >= this.data.columns) {
      throw new Error("Invalid column");
    }

    return this.blockedColumns.has(column);
  }

  public unblockRow(row: number): void {
    if (row < 0 || row >= this.data.rows) {
      throw new Error("Invalid row");
    }

    this.blockedRows.delete(row);
  }

  public unblockColumn(column: number): void {
    if (column < 0 || column >= this.data.columns) {
      throw new Error("Invalid column");
    }

    this.blockedColumns.delete(column);
  }

  public unblockCell(
    row: number,
    column: number
  ): void {
    if (!this.isValidPosition(row, column)) {
      throw new Error("Invalid board position");
    }

    this.data.cells[row][column].blocked = false;
  }

}