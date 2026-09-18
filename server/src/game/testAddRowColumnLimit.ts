import { Game } from "./Game";
import { addRowColumnCard } from "../game/cards/AddRowColumnCard";

const game = new Game(
  "player1",
  "player2",
  3,
  10,
  3
);

game.addCardToPlayer(
  "player1",
  addRowColumnCard
);

const card = game
  .getPlayerHand("player1")
  .find(
    (card) => card.type === "ADD_ROW_COLUMN"
  );

if (!card) {
  throw new Error(
    "ADD_ROW_COLUMN card was not found"
  );
}

console.log("Initial board:");
console.log(game.getBoard().getData().rows);

console.log("\nPlayer 1 tries to add another row");

try {
  game.useCard(
    "player1",
    card.id,
    {
      lineType: "column",
      position: 5,
    }
  );

  console.log("ERROR: Row was added when it should not be");
} catch (error) {
  console.log(
    "Expected error:",
    error instanceof Error
      ? error.message
      : error
  );
}

console.log(
  "\nFinal column:",
  game.getBoard().getData().columns
);