"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
console.log("Player 1 character:", game.getPlayerCharacter("player1"));
console.log("Player 2 character:", game.getPlayerCharacter("player2"));
