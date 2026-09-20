"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// game.addCardToPlayer(
//   "player1",
//   removeOpponentSignCard
// );
// Player 1 places X.
game.placeSign("player1", 0, 0);
// Player 2 places O.
game.placeSign("player2", 1, 1);
console.log("Board before removal:");
console.log(game.getBoard().getData());
const card = game
    .getPlayerHand("player1")
    .find((card) => card.type === "REMOVE_OPPONENT_SIGN");
if (!card) {
    throw new Error("Remove Opponent Sign card was not found");
}
console.log("\nPlayer 1 removes Player 2's O");
game.useCard("player1", card.id, {
    row: 2,
    column: 2,
});
console.log("Cell (1,1):", game.getBoard().getCell(1, 1));
