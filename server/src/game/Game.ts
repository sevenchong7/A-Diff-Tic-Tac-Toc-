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
import type { CardAction } from "./cards/CardAction";
import { moveSignEffect } from "./cards/effects/MoveSignEffect";
import { moveSignVerticalEffect } from "./cards/effects/MoveSignVerticalEffect";
import { moveRowColumnEffect } from "./cards/effects/MoveRowColumnEffect";

interface GamePlayer {
  id: string;
  sign: "X" | "O";
  cardManager: CardManager;
  doubleSkillActivationsRemaining: number;
}

export class Game {
  private board: Board;
  private players: GamePlayer[];
  private deck: CardDeck;

  private currentPlayerIndex: number;

  private skillCardsUsedThisTurn: number;

  private doubleSkillActive: boolean;

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
        doubleSkillActivationsRemaining: 3,
      },
      {
        id: player2Id,
        sign: "O",
        cardManager: new CardManager(),
        doubleSkillActivationsRemaining: 3,
      },
    ];

    this.players.forEach((player) => {
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
    });

    this.currentPlayerIndex = 0;

    this.skillCardsUsedThisTurn = 0;
    
    this.doubleSkillActive = false;

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

    this.skillCardsUsedThisTurn = 0;
    this.doubleSkillActive = false;

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    currentPlayer.cardManager.drawCard(this.deck);
  }

  public useCard(
    playerId: string,
    cardId: string,
    action: CardAction
  ): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    const maxSkillCardsThisTurn =
      this.doubleSkillActive ? 2 : 1;

    if (
      this.skillCardsUsedThisTurn >=
      maxSkillCardsThisTurn
    ) {
      throw new Error(
        `You can only use ${maxSkillCardsThisTurn} skill card${
          maxSkillCardsThisTurn > 1 ? "s" : ""
        } per turn`
      );
    }

    const hand = currentPlayer.cardManager.getHand();

    const card = hand.find(
      (card) => card.id === cardId
    );

    if (!card) {
      throw new Error("Card not found in hand");
    }

    if (
      card.type !== "MOVE_SIGN_HORIZONTAL" &&
      card.type !== "MOVE_SIGN_VERTICAL" &&
      card.type !== "MOVE_ROW_COLUMN"
    ) {
      throw new Error("This card cannot be used here");
    }

    if (card.type === "MOVE_SIGN_HORIZONTAL") {
      if (
        action.row === undefined ||
        action.column === undefined
      ) {
        throw new Error(
          "Move Sign requires row and column"
        );
      }

      if (
        action.direction !== "left" &&
        action.direction !== "right"
      ) {
        throw new Error(
          "Horizontal movement requires left or right"
        );
      }

      const cell = this.board.getCell(
        action.row,
        action.column
      );

      if (cell.sign !== currentPlayer.sign) {
        throw new Error(
          "You can only move your own sign"
        );
      }

      moveSignEffect(
        this.board,
        action.row,
        action.column,
        action.direction
      );
    }

    if (card.type === "MOVE_SIGN_VERTICAL") {
      if (
        action.row === undefined ||
        action.column === undefined
      ) {
        throw new Error(
          "Move Sign requires row and column"
        );
      }

      if (
        action.direction !== "up" &&
        action.direction !== "down"
      ) {
        throw new Error(
          "Vertical movement requires up or down"
        );
      }

      const cell = this.board.getCell(
        action.row,
        action.column
      );

      if (cell.sign !== currentPlayer.sign) {
        throw new Error(
          "You can only move your own sign"
        );
      }

      moveSignVerticalEffect(
        this.board,
        action.row,
        action.column,
        action.direction
      );
    }

    if (card.type === "MOVE_ROW_COLUMN") {
      if (
        action.direction === "left" ||
        action.direction === "right"
      ) {
        if (action.row === undefined) {
          throw new Error(
            "Row movement requires a row"
          );
        }

        moveRowColumnEffect(
          this.board,
          action.row,
          action.direction
        );
      }

      if (
        action.direction === "up" ||
        action.direction === "down"
      ) {
        if (action.column === undefined) {
          throw new Error(
            "Column movement requires a column"
          );
        }

        moveRowColumnEffect(
          this.board,
          action.column,
          action.direction
        );
      }
    }

    currentPlayer.cardManager.removeCard(cardId);

    this.skillCardsUsedThisTurn++;

    if (
      WinRule.hasWon(
        this.board,
        currentPlayer.sign,
        this.winRequirement
      )
    ) {
      this.status = "FINISHED";

      console.log(
        `${currentPlayer.id} wins!`
      );

      return;
    }
  }

  public activateDoubleSkill(playerId: string): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    if (
      currentPlayer.doubleSkillActivationsRemaining <= 0
    ) {
      throw new Error(
        "No Double Skill activations remaining"
      );
    }

    if (this.doubleSkillActive) {
      throw new Error(
        "Double Skill is already active"
      );
    }

    this.doubleSkillActive = true;

    currentPlayer.doubleSkillActivationsRemaining--;
  }

  public getDoubleSkillActivationsRemaining(
    playerId: string
  ): number {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.doubleSkillActivationsRemaining;
  }

  public getMaxSkillCardsThisTurn(): number {
    return this.doubleSkillActive ? 2 : 1;
  }

}