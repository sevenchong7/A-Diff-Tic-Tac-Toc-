"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const AddRowColumnCard_1 = require("../game/cards/AddRowColumnCard");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
game.addCardToPlayer("player1", AddRowColumnCard_1.addRowColumnCard);
console.log("Initial board:");
console.log(game.getBoard().getData());
// console.log("\nPlayer 1 hand:");
// console.log(game.getPlayerHand("player1"));
const card = game
    .getPlayerHand("player1")
    .find((card) => card.type === "ADD_ROW_COLUMN");
if (!card) {
    throw new Error("ADD_ROW_COLUMN card was not found in Player 1 hand");
}
console.log("\nPlayer 1 uses Add Row / Column");
game.useCard("player1", card.id, {
    lineType: "column",
    position: 1,
});
console.log("\nBoard after adding row:");
console.log(game.getBoard().getData());
