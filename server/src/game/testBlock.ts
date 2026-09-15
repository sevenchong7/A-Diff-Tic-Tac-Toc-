import { Game } from "./Game";
import { Board } from "./Board";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

// game.testBlockRow("player1", 1);

console.log(
  "Player 1 tries row 1:"
);

game.placeSign("player1", 1, 0);

console.log(
  game.getBoard()
);

console.log(
  "Player 2 tries row 1:"
);

try {
  game.placeSign("player2", 1, 1);
} catch (error) {
  console.log(
    "Expected error:",
    (error as Error).message
  );
}