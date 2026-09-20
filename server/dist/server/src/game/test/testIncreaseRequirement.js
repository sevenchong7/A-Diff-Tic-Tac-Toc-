"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
console.log("Player 1 requirement:", game.getPlayerWinRequirement("player1"));
console.log("Player 2 requirement:", game.getPlayerWinRequirement("player2"));
const player1Hand = game.getPlayerHand("player1");
const card = player1Hand.find((card) => card.type ===
    "INCREASE_OPPONENT_WIN_REQUIREMENT");
if (!card) {
    throw new Error("Increase Requirement card not found");
}
console.log("\nPlayer 1 uses Increase Requirement");
game.useCard("player1", card.id, {});
console.log("Player 1 requirement:", game.getPlayerWinRequirement("player1"));
console.log("Player 2 requirement:", game.getPlayerWinRequirement("player2"));
