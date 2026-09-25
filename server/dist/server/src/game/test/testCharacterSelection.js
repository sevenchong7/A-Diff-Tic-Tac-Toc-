"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// game.selectCharacter("player1", "START_5X5");
// game.selectCharacter("player2", "DOUBLE_SKILL");
// game.selectCharacter("player1", "DOUBLE_SKILL");
// game.selectCharacter("player2", "DOUBLE_DRAW");
// console.log(game.getBoard().getData());
// game.selectCharacter("player1", "DOUBLE_SKILL");
// game.selectCharacter("player2", "DOUBLE_DRAW");
game.selectCharacter("player1", "OPPONENT_5_SEC");
game.selectCharacter("player2", "DOUBLE_SKILL");
console.log(game.getTurnTimeLimit());
game.placeSign("player1", 0, 0);
console.log(game.getTurnTimeLimit());
// game.placeSign("player2", 1, 1);
// console.log(game.getBoard().getData());
// console.log(
//   "Player 1 character:",
//   game.getPlayerCharacter("player1")
// );
// console.log(
//   "Player 2 character:",
//   game.getPlayerCharacter("player2")
// );
// console.log("\nPlayer 1 selects DOUBLE_PLACEMENT");
// game.selectCharacter(
//   "player1",
//   "DOUBLE_PLACEMENT"
// );
// console.log(
//   "Player 1 character:",
//   game.getPlayerCharacter("player1")
// );
// console.log("\nPlayer 2 selects DOUBLE_SKILL");
// game.selectCharacter(
//   "player2",
//   "DOUBLE_SKILL"
// );
// console.log(
//   "Player 2 character:",
//   game.getPlayerCharacter("player2")
// );
// console.log(
//   "\nPlayer 1 activates Double Placement"
// );
// game.activateDoublePlacement("player1");
// console.log(
//   "Double Placement activations remaining:",
//   game.getDoublePlacementActivationsRemaining(
//     "player1"
//   )
// );
// console.log(
//   "Placements remaining:",
//   game.getPlacementsRemaining()
// );
// game.placeSign("player1", 0, 0);
// console.log(
//   "Placements remaining:",
//   game.getPlacementsRemaining()
// );
// game.placeSign("player1", 1, 1);
// console.log(
//   "Placements remaining:",
//   game.getPlacementsRemaining()
// );
