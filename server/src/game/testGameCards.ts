import { Game } from "./Game";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

console.log("Player 1 hand before draw:");

console.dir(
  game.getPlayerHand("player1"),
  { depth: null }
);

console.log("Player 1 draws:");

game.drawCard("player1");

console.log("Player 1 hand after draw:");

console.dir(
  game.getPlayerHand("player1"),
  { depth: null }
);

console.log("Player 2 hand:");

console.dir(
  game.getPlayerHand("player2"),
  { depth: null }
);