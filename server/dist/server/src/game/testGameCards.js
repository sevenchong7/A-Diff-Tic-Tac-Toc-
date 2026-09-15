"use strict";
// import { Game } from "./Game";
Object.defineProperty(exports, "__esModule", { value: true });
// const game = new Game(
//   "player1",
//   "player2",
//   3,
//   3,
//   3
// );
// console.log(
//   "Player 1 hand at start:"
// );
// console.dir(
//   game.getPlayerHand("player1"),
//   { depth: null }
// );
// console.log(
//   "Player 1 hand size:"
// );
// console.log(
//   game.getPlayerHand("player1").length
// );
// console.log(
//   "Double Draw remaining:"
// );
// console.log(
//   game.getDoubleDrawActivationsRemaining(
//     "player1"
//   )
// );
// console.log(
//   "Activating Double Draw..."
// );
// game.activateDoubleDraw("player1");
// console.log(
//   "Player 1 hand after Double Draw:"
// );
// console.dir(
//   game.getPlayerHand("player1"),
//   { depth: null }
// );
// console.log(
//   "Player 1 hand size after Double Draw:"
// );
// console.log(
//   game.getPlayerHand("player1").length
// );
// console.log(
//   "Double Draw remaining:"
// );
// console.log(
//   game.getDoubleDrawActivationsRemaining(
//     "player1"
//   )
// );
// const hand =
//   game.getPlayerHand("player1");
// console.log(
//   "Discarding first card..."
// );
// game.discardCard(
//   "player1",
//   hand[0].id
// );
// console.log(
//   "Player 1 hand size after discard:"
// );
// console.log(
//   game.getPlayerHand("player1").length
// );
const Game_1 = require("./Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
console.log("Initial hand size:", game.getPlayerHand("player1").length);
// Draw until the hand reaches 5
while (game.getPlayerHand("player1").length < 5) {
    game.drawCard("player1");
}
console.log("Hand size before Double Draw:", game.getPlayerHand("player1").length);
console.log("Activating Double Draw...");
game.activateDoubleDraw("player1");
console.log("Hand size after Double Draw:", game.getPlayerHand("player1").length);
// console.log(
//   "Trying to place a sign with too many cards..."
// );
// try {
//   game.placeSign("player1", 0, 0);
// } catch (error) {
//   console.log(
//     "Expected error:",
//     (error as Error).message
//   );
// }
const hand = game.getPlayerHand("player1");
// console.log(hand);
game.discardCard("player1", hand[0].id);
console.log("Hand size after Double Draw:", game.getPlayerHand("player1").length);
game.placeSign("player1", 0, 0);
