import { Game } from "../Game";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

console.log(
  "Player 1 character:",
  game.getPlayerCharacter("player1")
);

console.log(
  "Player 2 character:",
  game.getPlayerCharacter("player2")
);