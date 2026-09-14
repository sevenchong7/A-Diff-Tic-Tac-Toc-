"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./Board");
const WinRule_1 = require("./rules/WinRule");
const constants_1 = require("./constants");
const CardManager_1 = require("./cards/CardManager");
const CardDeck_1 = require("./cards/CardDeck");
const MoveSignEffect_1 = require("./cards/effects/MoveSignEffect");
const MoveSignVerticalEffect_1 = require("./cards/effects/MoveSignVerticalEffect");
const MoveRowColumnEffect_1 = require("./cards/effects/MoveRowColumnEffect");
class Game {
    board;
    players;
    deck;
    currentPlayerIndex;
    skillCardsUsedThisTurn;
    doubleSkillActive;
    status;
    winRequirement;
    constructor(player1Id, player2Id, rows, columns, winRequirement) {
        if (rows < constants_1.MIN_BOARD_ROWS ||
            rows > constants_1.MAX_BOARD_ROWS) {
            throw new Error(`Rows must be between ${constants_1.MIN_BOARD_ROWS} and ${constants_1.MAX_BOARD_ROWS}`);
        }
        if (columns < constants_1.MIN_BOARD_COLUMNS ||
            columns > constants_1.MAX_BOARD_COLUMNS) {
            throw new Error(`Columns must be between ${constants_1.MIN_BOARD_COLUMNS} and ${constants_1.MAX_BOARD_COLUMNS}`);
        }
        if (winRequirement < constants_1.MIN_WIN_REQUIREMENT ||
            winRequirement > constants_1.MAX_WIN_REQUIREMENT) {
            throw new Error(`Win requirement must be between ${constants_1.MIN_WIN_REQUIREMENT} and ${constants_1.MAX_WIN_REQUIREMENT}`);
        }
        if (winRequirement > rows &&
            winRequirement > columns) {
            throw new Error("Win requirement is impossible on this board");
        }
        this.board = new Board_1.Board(rows, columns);
        this.deck = new CardDeck_1.CardDeck();
        this.players = [
            {
                id: player1Id,
                sign: "X",
                cardManager: new CardManager_1.CardManager(),
                doubleSkillActivationsRemaining: 3,
            },
            {
                id: player2Id,
                sign: "O",
                cardManager: new CardManager_1.CardManager(),
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
    switchTurn() {
        this.currentPlayerIndex =
            this.currentPlayerIndex === 0 ? 1 : 0;
        this.startTurn();
    }
    isBoardFull() {
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
    placeSign(playerId, row, column) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        this.board.placeSign(row, column, currentPlayer.sign);
        const hasWon = WinRule_1.WinRule.hasWon(this.board, currentPlayer.sign, this.winRequirement);
        if (hasWon) {
            this.status = "FINISHED";
            console.log(`Player ${currentPlayer.id} (${currentPlayer.sign}) wins!`);
            return;
        }
        if (this.isBoardFull()) {
            this.status = "DRAW";
            console.log("Game ended in a draw!");
            return;
        }
        this.switchTurn();
    }
    getBoard() {
        return this.board.getData();
    }
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    getStatus() {
        return this.status;
    }
    moveSign(playerId, row, column, direction) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        const cell = this.board.getCell(row, column);
        if (cell.sign !== currentPlayer.sign) {
            throw new Error("You can only move your own sign");
        }
        this.board.moveSign(row, column, direction);
        const hasWon = WinRule_1.WinRule.hasWon(this.board, currentPlayer.sign, this.winRequirement);
        if (hasWon) {
            this.status = "FINISHED";
            console.log(`Player ${currentPlayer.id} (${currentPlayer.sign}) wins!`);
            return;
        }
    }
    drawCard(playerId) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        currentPlayer.cardManager.drawCard(this.deck);
    }
    getPlayerHand(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.cardManager.getHand();
    }
    startTurn() {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        this.skillCardsUsedThisTurn = 0;
        this.doubleSkillActive = false;
        const currentPlayer = this.players[this.currentPlayerIndex];
        currentPlayer.cardManager.drawCard(this.deck);
    }
    useCard(playerId, cardId, action) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        const maxSkillCardsThisTurn = this.doubleSkillActive ? 2 : 1;
        if (this.skillCardsUsedThisTurn >=
            maxSkillCardsThisTurn) {
            throw new Error(`You can only use ${maxSkillCardsThisTurn} skill card${maxSkillCardsThisTurn > 1 ? "s" : ""} per turn`);
        }
        const hand = currentPlayer.cardManager.getHand();
        const card = hand.find((card) => card.id === cardId);
        if (!card) {
            throw new Error("Card not found in hand");
        }
        if (card.type !== "MOVE_SIGN_HORIZONTAL" &&
            card.type !== "MOVE_SIGN_VERTICAL" &&
            card.type !== "MOVE_ROW_COLUMN") {
            throw new Error("This card cannot be used here");
        }
        if (card.type === "MOVE_SIGN_HORIZONTAL") {
            if (action.row === undefined ||
                action.column === undefined) {
                throw new Error("Move Sign requires row and column");
            }
            if (action.direction !== "left" &&
                action.direction !== "right") {
                throw new Error("Horizontal movement requires left or right");
            }
            const cell = this.board.getCell(action.row, action.column);
            if (cell.sign !== currentPlayer.sign) {
                throw new Error("You can only move your own sign");
            }
            (0, MoveSignEffect_1.moveSignEffect)(this.board, action.row, action.column, action.direction);
        }
        if (card.type === "MOVE_SIGN_VERTICAL") {
            if (action.row === undefined ||
                action.column === undefined) {
                throw new Error("Move Sign requires row and column");
            }
            if (action.direction !== "up" &&
                action.direction !== "down") {
                throw new Error("Vertical movement requires up or down");
            }
            const cell = this.board.getCell(action.row, action.column);
            if (cell.sign !== currentPlayer.sign) {
                throw new Error("You can only move your own sign");
            }
            (0, MoveSignVerticalEffect_1.moveSignVerticalEffect)(this.board, action.row, action.column, action.direction);
        }
        if (card.type === "MOVE_ROW_COLUMN") {
            if (action.direction === "left" ||
                action.direction === "right") {
                if (action.row === undefined) {
                    throw new Error("Row movement requires a row");
                }
                (0, MoveRowColumnEffect_1.moveRowColumnEffect)(this.board, action.row, action.direction);
            }
            if (action.direction === "up" ||
                action.direction === "down") {
                if (action.column === undefined) {
                    throw new Error("Column movement requires a column");
                }
                (0, MoveRowColumnEffect_1.moveRowColumnEffect)(this.board, action.column, action.direction);
            }
        }
        currentPlayer.cardManager.removeCard(cardId);
        this.skillCardsUsedThisTurn++;
        if (WinRule_1.WinRule.hasWon(this.board, currentPlayer.sign, this.winRequirement)) {
            this.status = "FINISHED";
            console.log(`${currentPlayer.id} wins!`);
            return;
        }
    }
    activateDoubleSkill(playerId) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        if (currentPlayer.doubleSkillActivationsRemaining <= 0) {
            throw new Error("No Double Skill activations remaining");
        }
        if (this.doubleSkillActive) {
            throw new Error("Double Skill is already active");
        }
        this.doubleSkillActive = true;
        currentPlayer.doubleSkillActivationsRemaining--;
    }
    getDoubleSkillActivationsRemaining(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.doubleSkillActivationsRemaining;
    }
}
exports.Game = Game;
