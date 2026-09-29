"use strict";
// import { Game } from "../Game";
Object.defineProperty(exports, "__esModule", { value: true });
// const game = new Game(
//   "player1",
//   "player2",
//   3,
//   3,
//   3
// );
// game.selectCharacter("player1", "BLOCK_LINE");
// game.selectCharacter("player2", "DOUBLE_SKILL");
// game.activateBlockLine("player1", "row", 1);
// console.log("P1 blocks row 1");
// game.placeSign("player1", 1, 0);
// console.log("P1 finished turn");
// game.placeSign("player2", 0, 0);
// console.log("P2 finished first blocked turn");
// game.placeSign("player1", 0, 1);
// console.log("P1 finished turn");
// game.placeSign("player2", 0, 2);
// console.log("P2 finished second blocked turn");
// game.placeSign("player1", 1, 1);
// console.log("P1 finished turn");
// game.placeSign("player2", 1, 2);
// console.log("P2 successfully placed after block expired");
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
game.selectCharacter("player1", "CHANGE_OPPONENT_WIN_RULE");
game.selectCharacter("player2", "CHANGE_OPPONENT_WIN_RULE");
console.log("Player 1 win requirement:", game.getWinRequirement("player1"));
console.log("Player 2 win requirement:", game.getWinRequirement("player2"));
