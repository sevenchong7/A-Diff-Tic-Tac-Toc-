"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// Player 1's turn
const player1 = game.getCurrentPlayer();
const blockCellCard = player1.cardManager
    .getHand()
    .find((card) => card.type === "BLOCK_CELL");
if (!blockCellCard) {
    throw new Error("Block Cell card not found");
}
console.log("Player 1 blocks cell (1,1)");
game.useCard(player1.id, blockCellCard.id, {
    row: 1,
    column: 1,
});
console.log("Cell after blocking:", game.getBoard().getCell(1, 1));
// Player 1 should be able to place there
console.log("Player 1 tries to place at (1,1)");
// game.placeSign(
//   player1.id,
//   1,
//   1
// );
// console.log(
//   "Player 1 placement succeeded:",
//   game.getBoard().getCell(1, 1)
// );
console.log("Player 1 places at (0,0)");
game.placeSign(player1.id, 0, 0);
console.log("Current player:", game.getCurrentPlayer().id);
console.log("Player 2 tries to place at blocked cell (1,1)");
try {
    game.placeSign("player2", 1, 1);
}
catch (error) {
    console.log("Expected error:", error.message);
}
