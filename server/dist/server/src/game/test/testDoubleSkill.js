"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
// Place Player 1's first sign
game.placeSign("player1", 0, 0);
// Place Player 1's first sign
game.placeSign("player2", 0, 1);
const hand = game.getPlayerHand("player1");
console.log("Initial hand:", hand);
console.log("Double Skill remaining:", game.getDoubleSkillActivationsRemaining("player1"));
console.log("Max skill cards before Double Skill:", game.getMaxSkillCardsThisTurn());
game.activateDoubleSkill("player1");
console.log("Max skill cards after Double Skill:", game.getMaxSkillCardsThisTurn());
game.useCard("player1", "move-sign-1", {
    "row": 0,
    "column": 0,
    direction: "right"
});
console.log("First skill card used");
game.useCard("player1", "move-sign-1", {
    "row": 0,
    "column": 1,
    direction: "right"
});
console.log("Second skill card used");
// game.useCard(
//   "player1",
//   "move-sign-1",
//   {
//     "row": 0,
//     "column": 2,
//     direction: "right"
//   }
// );
// console.log("Third skill card used");
// Place Player 1's first sign
game.placeSign("player1", 1, 1);
console.log("Player 1 placed a sign");
console.log("Double Skill remaining:", game.getDoubleSkillActivationsRemaining("player1"));
console.log("Max skill cards after Player 1 turn:", game.getMaxSkillCardsThisTurn());
// At this point the turn has switched to Player 2,
// so we cannot use a second card yet.
