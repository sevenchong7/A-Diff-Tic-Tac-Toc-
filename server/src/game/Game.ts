import { Card } from "./cards/Card";
import { Board } from "./Board";
import { WinRule } from "./rules/WinRule";
import {
  MIN_BOARD_ROWS,
  MAX_BOARD_ROWS,
  MIN_BOARD_COLUMNS,
  MAX_BOARD_COLUMNS,
  MIN_WIN_REQUIREMENT,
  MAX_WIN_REQUIREMENT,
  DEFAULT_TURN_TIME_MS,
  OPPONENT_5_SEC_TIME_MS
} from "./constants";
import { CardManager } from "./cards/CardManager";
import { CardDeck } from "./cards/CardDeck";
import type { CardAction } from "./cards/CardAction";
import type { CharacterType } from "./characters/CharacterType";

import { moveSignEffect } from "./cards/effects/MoveSignEffect";
import { moveSignVerticalEffect } from "./cards/effects/MoveSignVerticalEffect";
import { moveRowColumnEffect } from "./cards/effects/MoveRowColumnEffect";
import { blockCellEffect } from "./cards/effects/BlockCellEffect";
import { opponentSkillLockEffect } from "./cards/effects/opponentSkillLockEffect";
import { increaseOpponentWinRequirementEffect } from "./cards/effects/increaseOpponentWinRequirementEffect";
import { decreaseOwnWinRequirementEffect } from "./cards/effects/DecreaseOwnWinRequirementEffect";
import { removeOpponentSignEffect } from "./cards/effects/removeOpponentSignEffect";
import { removeRowColumnEffect } from "./cards/effects/removeRowColumnEffect";


interface GamePlayer {
  id: string;
  sign: "X" | "O";
  character: CharacterType | null;
  cardManager: CardManager;
  doubleSkillActivationsRemaining: number;
  doubleDrawActivationsRemaining: number;
  doublePlacementActivationsRemaining: number;
  winRequirement: number;
}

interface BlockedLine {
  type: "row" | "column";
  index: number;
  remainingTurns: number;
  blockedByPlayerId: string;
}

interface BlockedCell {
  row: number;
  column: number;
  remainingTurns: number;
  blockedByPlayerId: string;
}

export class Game {
  private board: Board;
  private players: GamePlayer[];
  private deck: CardDeck;

  private currentPlayerIndex: number;

  private skillCardsUsedThisTurn: number;

  private doubleSkillActive: boolean;

  private doubleDrawActive: boolean;

  private doublePlacementActive: boolean;

  private placementsRemaining: number;

  private turnTimer: ReturnType<typeof setTimeout> | null = null;

  private blockedLines: BlockedLine[];

  private blockedCells: BlockedCell[];

  private skillLockedPlayerIds: Set<string>;

  private status:
    | "CHARACTER_SELECT"
    | "PLAYING"
    | "FINISHED"
    | "DRAW";

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
        character: null,
        cardManager: new CardManager(),
        doubleSkillActivationsRemaining: 3,
        doubleDrawActivationsRemaining: 2,
        doublePlacementActivationsRemaining: 1,
        winRequirement: 3,
      },
      {
        id: player2Id,
        sign: "O",
        character: null,
        cardManager: new CardManager(),
        doubleSkillActivationsRemaining: 3,
        doubleDrawActivationsRemaining: 2,
        doublePlacementActivationsRemaining: 1,
        winRequirement: 3,
      },
    ];

    this.players.forEach((player) => {
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
      player.cardManager.drawCard(this.deck);
    });

    this.currentPlayerIndex = 0;

    this.blockedLines = [];

    this.blockedCells = [];

    this.skillCardsUsedThisTurn = 0;
    
    this.doubleSkillActive = false;

    this.doubleDrawActive = false;

    this.doublePlacementActive = false;

    this.placementsRemaining = 1;

    this.skillLockedPlayerIds = new Set();

    this.status = "CHARACTER_SELECT";

    this.winRequirement = winRequirement;

    // this.startTurn();
  }

  private switchTurn(): void {

    if (this.turnTimer !== null) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }

    const endingPlayer = this.players[this.currentPlayerIndex];

    this.updateBlockedLines(endingPlayer.id);

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

    if (currentPlayer.cardManager.needsDiscard()) {
      throw new Error(
        "You must discard cards before continuing"
      );
    }

    if (
      this.isPlacementBlocked(
        playerId,
        row,
        column
      )
    ) {
      throw new Error(
        "This position is blocked for you"
      );
    }

    if (
      this.isCellPlacementBlocked(
        playerId,
        row,
        column
      )
    ) {
      throw new Error(
        "This cell is blocked for you"
      );
    }

    this.board.placeSign(
      row,
      column,
      currentPlayer.sign
    );

    const hasWon = WinRule.hasWon(
      this.board,
      currentPlayer.sign,
      currentPlayer.winRequirement
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

    if (this.doublePlacementActive) {
      this.placementsRemaining--;

      if (this.placementsRemaining > 0) {
        return;
      }

      this.doublePlacementActive = false;
      this.placementsRemaining = 1;
    }

    this.switchTurn();
  }

  public getBoard(): Board {
    return this.board;
  }

  public getCurrentPlayer(): GamePlayer {
    return this.players[this.currentPlayerIndex];
  }

  public getStatus(): "CHARACTER_SELECT" | "PLAYING" | "FINISHED" | "DRAW" {
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

  public getPlayerWinRequirement(playerId: string): number {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.winRequirement;
  }

  public startTurn(): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    if (this.turnTimer !== null) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }

    this.skillCardsUsedThisTurn = 0;
    this.doubleSkillActive = false;
    this.doubleDrawActive = false;
    this.doublePlacementActive = false;
    this.placementsRemaining = 1;

    const currentPlayer = this.players[this.currentPlayerIndex];

    currentPlayer.cardManager.drawCard(this.deck);

    const turnTime = this.getCurrentTurnTimeLimit();

    this.turnTimer = setTimeout(() => {
      if (this.status !== "PLAYING") {
        return;
      }

      this.turnTimer = null;

      const currentPlayerAtTimeout =
        this.players[this.currentPlayerIndex];

      console.log(
        `Player ${currentPlayerAtTimeout.id}'s turn timed out`
      );

      this.switchTurn();
    }, turnTime);
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

    if (currentPlayer.cardManager.needsDiscard()) {
      throw new Error(
        "You must discard cards before continuing"
      );
    }

    if (this.isPlayerSkillLocked(playerId)) {
      throw new Error(
        "You cannot use Skill Cards during this turn"
      );
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
      card.type !== "MOVE_ROW_COLUMN" &&
      card.type !== "BLOCK_CELL" &&
      card.type !== "OPPONENT_SKILL_LOCK" &&
      card.type !== "INCREASE_OPPONENT_WIN_REQUIREMENT" &&
      card.type !== "DECREASE_OWN_WIN_REQUIREMENT" &&
      card.type !== "ADD_ROW_COLUMN" &&
      card.type !== "REMOVE_ROW_COLUMN" &&
      card.type !== "REMOVE_OPPONENT_SIGN"
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

    if (card.type === "BLOCK_CELL") {
      if (
        action.row === undefined ||
        action.column === undefined
      ) {
        throw new Error("Row and column are required");
      }

      blockCellEffect(
        this.board,
        action.row,
        action.column
      );

      this.addBlockedCell(
        action.row,
        action.column,
        playerId
      );
    }

    if (card.type === "ADD_ROW_COLUMN") {
      if (
        action.lineType === undefined ||
        action.position === undefined
      ) {
        throw new Error(
          "Line type and position are required"
        );
      }

      if (action.lineType === "row") {
        this.board.addRow(action.position);
      } else if (action.lineType === "column") {
        this.board.addColumn(action.position);
      } else {
        throw new Error(
          "Line type must be row or column"
        );
      }
    }

    if (card.type === "REMOVE_ROW_COLUMN") {
      if (
        action.lineType === undefined ||
        action.position === undefined
      ) {
        throw new Error(
          "Line type and position are required"
        );
      }

      if (action.lineType === "row") {
        removeRowColumnEffect(
          this.board,
          "row",
          action.position
        );
      } else if (action.lineType === "column") {
        removeRowColumnEffect(
          this.board,
          "column",
          action.position
        );
      } else {
        throw new Error(
          "Line type must be row or column"
        );
      }
    }

    if (card.type === "OPPONENT_SKILL_LOCK") {
      const opponent = this.players.find(
        (player) => player.id !== currentPlayer.id
      );

      if (!opponent) {
        throw new Error("Opponent not found");
      }

      opponentSkillLockEffect();

      this.lockPlayerFromSkills(opponent.id);
    }

    if (card.type === "INCREASE_OPPONENT_WIN_REQUIREMENT") {
      const opponent = this.players.find(
        (player) => player.id !== currentPlayer.id
      );

      if (!opponent) {
        throw new Error("Opponent not found");
      }

      if (opponent.winRequirement >= 7) {
        throw new Error(
          "Opponent win requirement is already at maximum"
        );
      }

      opponent.winRequirement =
        increaseOpponentWinRequirementEffect(
          opponent.winRequirement
        );
    }

    if (card.type === "DECREASE_OWN_WIN_REQUIREMENT") {
      if (currentPlayer.winRequirement <= 3) {
        throw new Error(
          "Your win requirement is already at minimum"
        );
      }

      currentPlayer.winRequirement =
        decreaseOwnWinRequirementEffect(
          currentPlayer.winRequirement
        );
    }

    if (card.type === "REMOVE_OPPONENT_SIGN") {
      if (
        action.row === undefined ||
        action.column === undefined
      ) {
        throw new Error("Row and column are required");
      }

      const targetCell = this.board.getCell(
        action.row,
        action.column
      );

      if (targetCell.sign === null) {
        throw new Error(
          "There is no sign to remove"
        );
      }

      if (targetCell.sign === currentPlayer.sign) {
        throw new Error(
          "You cannot remove your own sign"
        );
      }

      removeOpponentSignEffect(
        this.board,
        action.row,
        action.column
      );
    }

    currentPlayer.cardManager.removeCard(cardId);

    this.skillCardsUsedThisTurn++;

    if (
      WinRule.hasWon(
        this.board,
        currentPlayer.sign,
        currentPlayer.winRequirement
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

    if (!this.playerHasCharacter(playerId, "DOUBLE_SKILL")) {
      throw new Error(
        "This character does not have Double Skill"
      );
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

  public activateDoubleDraw(playerId: string): void {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    if (!this.playerHasCharacter(playerId, "DOUBLE_DRAW")) {
      throw new Error(
        "This character does not have Double Draw"
      );
    }

    if (
      currentPlayer.doubleDrawActivationsRemaining <= 0
    ) {
      throw new Error(
        "No Double Draw activations remaining"
      );
    }

    if (this.doubleDrawActive) {
      throw new Error(
        "Double Draw is already active"
      );
    }

    this.doubleDrawActive = true;

    currentPlayer.cardManager.drawCard(this.deck);

    currentPlayer.doubleDrawActivationsRemaining--;
  }

  public getDoubleDrawActivationsRemaining(
    playerId: string
  ): number {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.doubleDrawActivationsRemaining;
  }

  public discardCard(
    playerId: string,
    cardId: string
  ): void {
    if (this.status !== "PLAYING") {
      throw new Error(
        "Game is not currently playing"
      );
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    currentPlayer.cardManager.discardCard(cardId);
  }

  private isPlacementBlocked(
    playerId: string,
    row: number,
    column: number
  ): boolean {
    return this.blockedLines.some(
      (blockedLine) => {
        const affectsPosition =
          (blockedLine.type === "row" &&
            blockedLine.index === row) ||
          (blockedLine.type === "column" &&
            blockedLine.index === column);

        return (
          affectsPosition &&
          blockedLine.blockedByPlayerId !== playerId
        );
      }
    );
  }

  private addBlockedLine(
    type: "row" | "column",
    index: number,
    playerId: string
  ): void {
    this.blockedLines.push({
      type,
      index,
      remainingTurns: 2,
      blockedByPlayerId: playerId,
    });
  }

  private updateBlockedLines(playerId: string): void {
    for (const blockedLine of this.blockedLines) {
      if (blockedLine.blockedByPlayerId !== playerId) {
        blockedLine.remainingTurns--;
      }
    }

    this.blockedLines = this.blockedLines.filter(
      (blockedLine) =>
        blockedLine.remainingTurns > 0
    );

    for (const blockedCell of this.blockedCells) {
      if (blockedCell.blockedByPlayerId !== playerId) {
        blockedCell.remainingTurns--;
      }
    }

    this.blockedCells = this.blockedCells.filter(
      (blockedCell) => {
        if (blockedCell.remainingTurns <= 0) {
          this.board.unblockCell(
            blockedCell.row,
            blockedCell.column
          );

          return false;
        }

        return true;
      }
    );

    this.skillLockedPlayerIds.delete(playerId);
  }

  private addBlockedCell(
    row: number,
    column: number,
    playerId: string
  ): void {
    this.blockedCells.push({
      row,
      column,
      remainingTurns: 2,
      blockedByPlayerId: playerId,
    });
  }

  private isCellPlacementBlocked(
    playerId: string,
    row: number,
    column: number
  ): boolean {
    return this.blockedCells.some(
      (blockedCell) =>
        blockedCell.row === row &&
        blockedCell.column === column &&
        blockedCell.blockedByPlayerId !== playerId
    );
  }

  private lockPlayerFromSkills(playerId: string): void {
    this.skillLockedPlayerIds.add(playerId);
  }

  private isPlayerSkillLocked(playerId: string): boolean {
    return this.skillLockedPlayerIds.has(playerId);
  }

  public addCardToPlayer(
    playerId: string,
    card: Card
  ): void {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    player.cardManager.addCard(card);
  }

  public getPlayerCharacter(
    playerId: string
  ): CharacterType {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    if (player.character === null) {
      throw new Error("Character not selected yet");
    }

    return player.character;
  }

  public selectCharacter(
    playerId: string,
    character: CharacterType
  ): void {
    if (this.status !== "CHARACTER_SELECT") {
      throw new Error(
        "Character selection is not currently active"
      );
    }

    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    if (player.character !== null) {
      throw new Error(
        "Character has already been selected"
      );
    }

    player.character = character;

    const allPlayersSelected = this.players.every(
      (player) => player.character !== null
    );

    if (allPlayersSelected) {
      this.applyCharacterStartEffects();

      this.status = "PLAYING";
      this.startTurn();
    }
  }

  public getDoublePlacementActivationsRemaining(
    playerId: string
  ): number {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.doublePlacementActivationsRemaining;
  }

  public activateDoublePlacement(
    playerId: string
  ): void {
    if (this.status !== "PLAYING") {
      throw new Error(
        "Game is not currently playing"
      );
    }

    const currentPlayer =
      this.players[this.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      throw new Error("It is not your turn");
    }

    if (!this.playerHasCharacter(playerId, "DOUBLE_PLACEMENT")) {
      throw new Error(
        "This character does not have Double Placement"
      );
    }

    if (
      currentPlayer.doublePlacementActivationsRemaining <= 0
    ) {
      throw new Error(
        "No Double Placement activations remaining"
      );
    }

    if (this.doublePlacementActive) {
      throw new Error(
        "Double Placement is already active"
      );
    }

    this.doublePlacementActive = true;

    this.placementsRemaining = 2;

    currentPlayer.doublePlacementActivationsRemaining--;
  }

  public getPlacementsRemaining(): number {
    return this.placementsRemaining;
  }

  public getTurnTimeLimit(): number {
    if (this.status !== "PLAYING") {
      throw new Error("Game is not currently playing");
    }

    return this.getCurrentTurnTimeLimit();
  }

  private getCurrentTurnTimeLimit(): number {
    const currentPlayer = this.players[this.currentPlayerIndex];

    const hasOpponent5Sec = this.players.some(
      (player) =>
        player.character === "OPPONENT_5_SEC" &&
        player.id !== currentPlayer.id
    );

    return hasOpponent5Sec
      ? OPPONENT_5_SEC_TIME_MS
      : DEFAULT_TURN_TIME_MS;
  }

  private applyCharacterStartEffects(): void {
    const hasStart5x5Character = this.players.some(
      (player) => player.character === "START_5X5"
    );

    if (hasStart5x5Character) {
      this.board = new Board(5, 5);
    }
  }

  private playerHasCharacter(
    playerId: string,
    character: CharacterType
  ): boolean {
    const player = this.players.find(
      (player) => player.id === playerId
    );

    if (!player) {
      throw new Error("Player not found");
    }

    return player.character === character;
  }


}