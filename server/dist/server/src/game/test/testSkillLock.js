"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
const player1 = game.getPlayerHand("player1");
const player2 = game.getPlayerHand("player2");
console.log("Player 1 hand:");
console.log(player1);
const skillLockCard = player1.find((card) => card.type === "OPPONENT_SKILL_LOCK");
if (!skillLockCard) {
    throw new Error("Skill Lock card was not found in Player 1's hand");
}
console.log("\nPlayer 1 uses Skill Lock");
game.useCard("player1", skillLockCard.id, {});
console.log("Skill Lock applied to Player 2");
console.log("\nPlayer 1 places a sign");
game.placeSign("player1", 0, 0);
console.log("\nPlayer 2 tries to use a Skill Card");
const player2Hand = game.getPlayerHand("player2");
const player2Card = player2Hand.find((card) => card.type !== "OPPONENT_SKILL_LOCK");
if (!player2Card) {
    throw new Error("Player 2 does not have a suitable Skill Card");
}
try {
    game.useCard("player2", player2Card.id, {});
    throw new Error("Expected Player 2 to be blocked from using a Skill Card");
}
catch (error) {
    console.log("Expected error:", error instanceof Error
        ? error.message
        : error);
}
console.log("\nPlayer 2 places a sign");
game.placeSign("player2", 1, 1);
console.log("\nPlayer 1 places a sign");
game.placeSign("player1", 0, 1);
console.log("\nPlayer 2 tries to use a Skill Card again");
const player2CardAfterLock = game.getPlayerHand("player2").find((card) => card.type !== "OPPONENT_SKILL_LOCK");
if (!player2CardAfterLock) {
    throw new Error("Player 2 does not have a suitable Skill Card");
}
// console.log(player2);
try {
    game.useCard("player2", player2CardAfterLock.id, {});
    console.log("Player 2 can use Skill Cards again");
}
catch (error) {
    console.log("Unexpected error:", error instanceof Error
        ? error.message
        : error);
}
