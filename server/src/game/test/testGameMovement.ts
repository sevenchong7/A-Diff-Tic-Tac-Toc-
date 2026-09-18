import { Game } from "../Game";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

// Player 1 places X
game.placeSign("player1", 0, 0);

// Player 2 places O
game.placeSign("player2", 2, 2);

console.log("Before movement:");
console.dir(game.getBoard(), { depth: null });

// Player 1's turn again
console.log("Player 1 moves X right:");

// game.moveSign(
//   "player1",
//   0,
//   0,
//   "right"
// );

game.moveSign(
  "player1",
  2,
  2,
  "left"
);

console.dir(game.getBoard(), { depth: null });