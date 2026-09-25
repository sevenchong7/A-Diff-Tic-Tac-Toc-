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
const BlockCellEffect_1 = require("./cards/effects/BlockCellEffect");
const opponentSkillLockEffect_1 = require("./cards/effects/opponentSkillLockEffect");
const increaseOpponentWinRequirementEffect_1 = require("./cards/effects/increaseOpponentWinRequirementEffect");
const DecreaseOwnWinRequirementEffect_1 = require("./cards/effects/DecreaseOwnWinRequirementEffect");
const removeOpponentSignEffect_1 = require("./cards/effects/removeOpponentSignEffect");
const removeRowColumnEffect_1 = require("./cards/effects/removeRowColumnEffect");
class Game {
    board;
    players;
    deck;
    currentPlayerIndex;
    skillCardsUsedThisTurn;
    doubleSkillActive;
    doubleDrawActive;
    doublePlacementActive;
    placementsRemaining;
    turnTimer = null;
    blockedLines;
    blockedCells;
    skillLockedPlayerIds;
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
                character: null,
                cardManager: new CardManager_1.CardManager(),
                doubleSkillActivationsRemaining: 3,
                doubleDrawActivationsRemaining: 2,
                doublePlacementActivationsRemaining: 1,
                winRequirement: 3,
            },
            {
                id: player2Id,
                sign: "O",
                character: null,
                cardManager: new CardManager_1.CardManager(),
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
    switchTurn() {
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
        if (currentPlayer.cardManager.needsDiscard()) {
            throw new Error("You must discard cards before continuing");
        }
        if (this.isPlacementBlocked(playerId, row, column)) {
            throw new Error("This position is blocked for you");
        }
        if (this.isCellPlacementBlocked(playerId, row, column)) {
            throw new Error("This cell is blocked for you");
        }
        this.board.placeSign(row, column, currentPlayer.sign);
        const hasWon = WinRule_1.WinRule.hasWon(this.board, currentPlayer.sign, currentPlayer.winRequirement);
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
    getBoard() {
        return this.board;
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
    getPlayerWinRequirement(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.winRequirement;
    }
    startTurn() {
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
            const currentPlayerAtTimeout = this.players[this.currentPlayerIndex];
            console.log(`Player ${currentPlayerAtTimeout.id}'s turn timed out`);
            this.switchTurn();
        }, turnTime);
    }
    useCard(playerId, cardId, action) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        if (currentPlayer.cardManager.needsDiscard()) {
            throw new Error("You must discard cards before continuing");
        }
        if (this.isPlayerSkillLocked(playerId)) {
            throw new Error("You cannot use Skill Cards during this turn");
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
            card.type !== "MOVE_ROW_COLUMN" &&
            card.type !== "BLOCK_CELL" &&
            card.type !== "OPPONENT_SKILL_LOCK" &&
            card.type !== "INCREASE_OPPONENT_WIN_REQUIREMENT" &&
            card.type !== "DECREASE_OWN_WIN_REQUIREMENT" &&
            card.type !== "ADD_ROW_COLUMN" &&
            card.type !== "REMOVE_ROW_COLUMN" &&
            card.type !== "REMOVE_OPPONENT_SIGN") {
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
        if (card.type === "BLOCK_CELL") {
            if (action.row === undefined ||
                action.column === undefined) {
                throw new Error("Row and column are required");
            }
            (0, BlockCellEffect_1.blockCellEffect)(this.board, action.row, action.column);
            this.addBlockedCell(action.row, action.column, playerId);
        }
        if (card.type === "ADD_ROW_COLUMN") {
            if (action.lineType === undefined ||
                action.position === undefined) {
                throw new Error("Line type and position are required");
            }
            if (action.lineType === "row") {
                this.board.addRow(action.position);
            }
            else if (action.lineType === "column") {
                this.board.addColumn(action.position);
            }
            else {
                throw new Error("Line type must be row or column");
            }
        }
        if (card.type === "REMOVE_ROW_COLUMN") {
            if (action.lineType === undefined ||
                action.position === undefined) {
                throw new Error("Line type and position are required");
            }
            if (action.lineType === "row") {
                (0, removeRowColumnEffect_1.removeRowColumnEffect)(this.board, "row", action.position);
            }
            else if (action.lineType === "column") {
                (0, removeRowColumnEffect_1.removeRowColumnEffect)(this.board, "column", action.position);
            }
            else {
                throw new Error("Line type must be row or column");
            }
        }
        if (card.type === "OPPONENT_SKILL_LOCK") {
            const opponent = this.players.find((player) => player.id !== currentPlayer.id);
            if (!opponent) {
                throw new Error("Opponent not found");
            }
            (0, opponentSkillLockEffect_1.opponentSkillLockEffect)();
            this.lockPlayerFromSkills(opponent.id);
        }
        if (card.type === "INCREASE_OPPONENT_WIN_REQUIREMENT") {
            const opponent = this.players.find((player) => player.id !== currentPlayer.id);
            if (!opponent) {
                throw new Error("Opponent not found");
            }
            if (opponent.winRequirement >= 7) {
                throw new Error("Opponent win requirement is already at maximum");
            }
            opponent.winRequirement =
                (0, increaseOpponentWinRequirementEffect_1.increaseOpponentWinRequirementEffect)(opponent.winRequirement);
        }
        if (card.type === "DECREASE_OWN_WIN_REQUIREMENT") {
            if (currentPlayer.winRequirement <= 3) {
                throw new Error("Your win requirement is already at minimum");
            }
            currentPlayer.winRequirement =
                (0, DecreaseOwnWinRequirementEffect_1.decreaseOwnWinRequirementEffect)(currentPlayer.winRequirement);
        }
        if (card.type === "REMOVE_OPPONENT_SIGN") {
            if (action.row === undefined ||
                action.column === undefined) {
                throw new Error("Row and column are required");
            }
            const targetCell = this.board.getCell(action.row, action.column);
            if (targetCell.sign === null) {
                throw new Error("There is no sign to remove");
            }
            if (targetCell.sign === currentPlayer.sign) {
                throw new Error("You cannot remove your own sign");
            }
            (0, removeOpponentSignEffect_1.removeOpponentSignEffect)(this.board, action.row, action.column);
        }
        currentPlayer.cardManager.removeCard(cardId);
        this.skillCardsUsedThisTurn++;
        if (WinRule_1.WinRule.hasWon(this.board, currentPlayer.sign, currentPlayer.winRequirement)) {
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
    getMaxSkillCardsThisTurn() {
        return this.doubleSkillActive ? 2 : 1;
    }
    activateDoubleDraw(playerId) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        if (currentPlayer.doubleDrawActivationsRemaining <= 0) {
            throw new Error("No Double Draw activations remaining");
        }
        if (this.doubleDrawActive) {
            throw new Error("Double Draw is already active");
        }
        this.doubleDrawActive = true;
        currentPlayer.cardManager.drawCard(this.deck);
        currentPlayer.doubleDrawActivationsRemaining--;
    }
    getDoubleDrawActivationsRemaining(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.doubleDrawActivationsRemaining;
    }
    discardCard(playerId, cardId) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        currentPlayer.cardManager.discardCard(cardId);
    }
    isPlacementBlocked(playerId, row, column) {
        return this.blockedLines.some((blockedLine) => {
            const affectsPosition = (blockedLine.type === "row" &&
                blockedLine.index === row) ||
                (blockedLine.type === "column" &&
                    blockedLine.index === column);
            return (affectsPosition &&
                blockedLine.blockedByPlayerId !== playerId);
        });
    }
    addBlockedLine(type, index, playerId) {
        this.blockedLines.push({
            type,
            index,
            remainingTurns: 2,
            blockedByPlayerId: playerId,
        });
    }
    updateBlockedLines(playerId) {
        for (const blockedLine of this.blockedLines) {
            if (blockedLine.blockedByPlayerId !== playerId) {
                blockedLine.remainingTurns--;
            }
        }
        this.blockedLines = this.blockedLines.filter((blockedLine) => blockedLine.remainingTurns > 0);
        for (const blockedCell of this.blockedCells) {
            if (blockedCell.blockedByPlayerId !== playerId) {
                blockedCell.remainingTurns--;
            }
        }
        this.blockedCells = this.blockedCells.filter((blockedCell) => {
            if (blockedCell.remainingTurns <= 0) {
                this.board.unblockCell(blockedCell.row, blockedCell.column);
                return false;
            }
            return true;
        });
        this.skillLockedPlayerIds.delete(playerId);
    }
    addBlockedCell(row, column, playerId) {
        this.blockedCells.push({
            row,
            column,
            remainingTurns: 2,
            blockedByPlayerId: playerId,
        });
    }
    isCellPlacementBlocked(playerId, row, column) {
        return this.blockedCells.some((blockedCell) => blockedCell.row === row &&
            blockedCell.column === column &&
            blockedCell.blockedByPlayerId !== playerId);
    }
    lockPlayerFromSkills(playerId) {
        this.skillLockedPlayerIds.add(playerId);
    }
    isPlayerSkillLocked(playerId) {
        return this.skillLockedPlayerIds.has(playerId);
    }
    addCardToPlayer(playerId, card) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        player.cardManager.addCard(card);
    }
    getPlayerCharacter(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        if (player.character === null) {
            throw new Error("Character not selected yet");
        }
        return player.character;
    }
    selectCharacter(playerId, character) {
        if (this.status !== "CHARACTER_SELECT") {
            throw new Error("Character selection is not currently active");
        }
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        if (player.character !== null) {
            throw new Error("Character has already been selected");
        }
        player.character = character;
        const allPlayersSelected = this.players.every((player) => player.character !== null);
        if (allPlayersSelected) {
            this.applyCharacterStartEffects();
            this.status = "PLAYING";
            this.startTurn();
        }
    }
    getDoublePlacementActivationsRemaining(playerId) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.doublePlacementActivationsRemaining;
    }
    activateDoublePlacement(playerId) {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.id !== playerId) {
            throw new Error("It is not your turn");
        }
        if (currentPlayer.character !== "DOUBLE_PLACEMENT") {
            throw new Error("This character does not have Double Placement");
        }
        if (currentPlayer.doublePlacementActivationsRemaining <= 0) {
            throw new Error("No Double Placement activations remaining");
        }
        if (this.doublePlacementActive) {
            throw new Error("Double Placement is already active");
        }
        this.doublePlacementActive = true;
        this.placementsRemaining = 2;
        currentPlayer.doublePlacementActivationsRemaining--;
    }
    getPlacementsRemaining() {
        return this.placementsRemaining;
    }
    getTurnTimeLimit() {
        if (this.status !== "PLAYING") {
            throw new Error("Game is not currently playing");
        }
        return this.getCurrentTurnTimeLimit();
    }
    getCurrentTurnTimeLimit() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const hasOpponent5Sec = this.players.some((player) => player.character === "OPPONENT_5_SEC" &&
            player.id !== currentPlayer.id);
        return hasOpponent5Sec
            ? constants_1.OPPONENT_5_SEC_TIME_MS
            : constants_1.DEFAULT_TURN_TIME_MS;
    }
    applyCharacterStartEffects() {
        const hasStart5x5Character = this.players.some((player) => player.character === "START_5X5");
        if (hasStart5x5Character) {
            this.board = new Board_1.Board(5, 5);
        }
    }
    playerHasCharacter(playerId, character) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        return player.character === character;
    }
}
exports.Game = Game;
