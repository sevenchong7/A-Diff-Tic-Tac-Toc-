"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// -------------------------
// Player 1 blocks (1,1)
// -------------------------
const player1 = game.getCurrentPlayer();
const blockCellCard = player1.cardManager
    .getHand()
    .find((card) => card.type === "BLOCK_CELL");
if (!blockCellCard) {
    throw new Error("Block Cell card not found");
}
console.log("Player 1 blocks (1,1)");
game.useCard(player1.id, blockCellCard.id, {
    row: 1,
    column: 1,
});
console.log("Cell:", game.getBoard().getCell(1, 1));
// -------------------------
// End Player 1's turn
// -------------------------
console.log("Player 1 places at (0,0)");
game.placeSign(player1.id, 0, 0);
console.log("Current player:", game.getCurrentPlayer().id);
// -------------------------
// Player 2 — Turn 1
// -------------------------
console.log("Player 2 — Turn 1");
try {
    game.placeSign("player2", 1, 1);
}
catch (error) {
    console.log("Expected error:", error.message);
}
// End Player 2 Turn 1
game.placeSign("player2", 0, 1);
// -------------------------
// Player 1's turn
// -------------------------
console.log("Player 1's turn");
game.placeSign("player1", 0, 2);
// -------------------------
// Player 2 — Turn 2
// -------------------------
console.log("Player 2 — Turn 2");
try {
    game.placeSign("player2", 1, 1);
}
catch (error) {
    console.log("Expected error:", error.message);
}
// End Player 2 Turn 2
game.placeSign("player2", 2, 0);
// -------------------------
// Player 1's turn
// -------------------------
console.log("Player 1's turn — block should expire");
console.log("Cell after expiration:", game.getBoard().getCell(1, 1));
// -------------------------
// Player 1 can now place
// -------------------------
game.placeSign("player1", 1, 1);
console.log("Final cell:", game.getBoard().getCell(1, 1));
