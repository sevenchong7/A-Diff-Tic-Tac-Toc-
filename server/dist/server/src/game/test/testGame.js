"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// Player 1 places a sign
game.placeSign("player1", 0, 0);
game.placeSign("player2", 0, 1);
console.log("Player 1 hand:");
console.dir(game.getPlayerHand("player1"), { depth: null });
console.log("Board before card:");
console.dir(game.getBoard(), { depth: null });
const hand = game.getPlayerHand("player1");
const card = hand[0];
console.log("Using card:", card);
// game.useCard(
//   "player1",
//   card.id,
//   0,
//   0,
//   "right"
// );
game.useCard("player1", card.id, {
    "row": 0,
    "column": 0,
    direction: "right"
});
// const secondHand = game.getPlayerHand("player1");
// console.log("Player 1 hand:");
// console.dir(secondHand, { depth: null });
// const secondCard = secondHand[0];
// game.useCard(
//   "player1",
//   secondCard.id,
//   0,
//   1,
//   "right"
// );
console.log("Board after card:");
console.dir(game.getBoard(), { depth: null });
console.log("Player 1 hand after using card:");
console.dir(game.getPlayerHand("player1"), { depth: null });
console.log("Current player:", game.getCurrentPlayer());
