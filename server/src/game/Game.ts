import { Board } from "./Board";
import { WinRule } from "./rules/WinRule";
import {
  MIN_BOARD_ROWS,
  MAX_BOARD_ROWS,
  MIN_BOARD_COLUMNS,
  MAX_BOARD_COLUMNS,
  MIN_WIN_REQUIREMENT,
  MAX_WIN_REQUIREMENT,
} from "./constants";
import { CardManager } from "./cards/CardManager";
import { CardDeck } from "./cards/CardDeck";

interface GamePlayer {
  id: string;
  sign: "X" | "O";
  cardManager: CardManager;
}

export class Game {
  private board: Board;
  private players: GamePlayer[];
  private deck: CardDeck;

  private currentPlayerIndex: number;

  private status: "PLAYING" | "FINISHED" | "DRAW";

  private winRequirement: number;

  constructor(
    player1Id: string,
    player2Id: string,
    rows: number,
    columns: number,
    winRequirement: number
  ) {
    if (
      rows < MIN_BOARD_ROWS ||
      rows > MAX_BOARD_ROWS
    ) {
      throw new Error(
        `Rows must be between ${MIN_BOARD_ROWS} and ${MAX_BOARD_ROWS}`
      );
    }

    if (
      columns < MIN_BOARD_COLUMNS ||
      columns > MAX_BOARD_COLUMNS
    ) {
      throw new Error(
        `Columns must be between ${MIN_BOARD_COLUMNS} and ${MAX_BOARD_COLUMNS}`
      );
    }

    if (
      winRequirement < MIN_WIN_REQUIREMENT ||
      winRequirement > MAX_WIN_REQUIREMENT
    ) {
      throw new Error(
        `Win requirement must be between ${MIN_WIN_REQUIREMENT} and ${MAX_WIN_REQUIREMENT}`
      );
    }

    if (
      winRequirement > rows &&
      winRequirement > columns
    ) {
      throw new Error(
        "Win requirement is impossible on this board"
      );
    }

    this.board = new Board(rows, columns);

    this.deck = new CardDeck();

    this.players = [
      {
        id: player1Id,
        sign: "X",
        cardManager: new CardManager(),
      },
      {
        id: player2Id,
        sign: "O",
        cardManager: new CardManager(),
      },
    ];

    this.players.forEach((player) => {
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
    });

    this.currentPlayerIndex = 0;

    this.status = "PLAYING";

    this.winRequirement = winRequirement;

    this.startTurn();
  }

  private switchTurn(): void {
    this.currentPlayerIndex =
      this.currentPlayerIndex === 0 ? 1 : 0;

    this.startTurn();
  }

 private isBoardFull(): boolean {
  const board = this.board.getData();

  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.sign === null) {
        return false;
      }
    }
  }

  return true;
  }

  public placeSign(
    playerId: string,
    row: number,
    column: number
  ): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer = this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    this.board.placeSign(
      row,
      column,
      currentPlayer.sign
    );

    const hasWon = WinRule.hasWon(
      this.board,
      currentPlayer.sign,
      this.winRequirement
    );

    if (hasWon) {
      this.status = "FINISHED";

      console.log(
        `Player ${currentPlayer.id} (${currentPlayer.sign}) wins!`
      );

      return;
    }

    if (this.isBoardFull()) {
      this.status = "DRAW";

      console.log("Game ended in a draw!");

      return;
    }

    this.switchTurn();
  }

  public getBoard(): ReturnType<Board["getData"]> {
    return this.board.getData();
  }

  public getCurrentPlayer(): GamePlayer {
    return this.players[this.currentPlayerIndex];
  }

  public getStatus(): "PLAYING" | "FINISHED" | "DRAW" {
    return this.status;
  }

  public moveSign(
    playerId: string,
    row: number,
    column: number,
    direction: "up" | "down" | "left" | "right"
  ): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    const cell = this.board.getCell(row, column);

    if (cell.sign !== currentPlayer.sign) {
      throw new Error("You can only move your own sign");
    }

    this.board.moveSign(
      row,
      column,
      direction
    );

    const hasWon = WinRule.hasWon(
      this.board,
      currentPlayer.sign,
      this.winRequirement
    );

    if (hasWon) {
      this.status = "FINISHED";

      console.log(
        `Player ${currentPlayer.id} (${currentPlayer.sign}) wins!`
      );

      return;
    }
  }

  public drawCard(playerId: string): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    currentPlayer.cardManager.drawCard(this.deck);
  }

  public getPlayerHand(playerId: string) {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.cardManager.getHand();
  }

  public startTurn(): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    currentPlayer.cardManager.drawCard(this.deck);
  }

}