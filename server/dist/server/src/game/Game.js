"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./Board");
const WinRule_1 = require("./rules/WinRule");
const constants_1 = require("./constants");
class Game {
    board;
    players;
    currentPlayerIndex;
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
        this.players = [
            {
                id: player1Id,
                sign: "X",
            },
            {
                id: player2Id,
                sign: "O",
            },
        ];
        this.currentPlayerIndex = 0;
        this.status = "PLAYING";
        this.winRequirement = winRequirement;
    }
    switchTurn() {
        this.currentPlayerIndex =
            this.currentPlayerIndex === 0 ? 1 : 0;
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
}
exports.Game = Game;
