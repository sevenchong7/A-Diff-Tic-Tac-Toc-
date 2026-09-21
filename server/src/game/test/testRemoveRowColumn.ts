import { Game } from "../Game";
import { removeRowColumnCard } from "../cards/RemoveRowColumnCard";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

// game.addCardToPlayer(
//   "player1",
//   removeRowColumnCard
// );

console.log("Initial board:");
console.log(game.getBoard().getData());

console.log(game.getPlayerHand("player1"));

const card = game
  .getPlayerHand("player1")
  .find(
    (card) =>
      card.type === "REMOVE_ROW_COLUMN"
  );

if (!card) {
  throw new Error(
    "Remove Row / Column card was not found"
  );
}

console.log("\nPlayer 1 removes row 1");

try {

game.useCard(
  "player1",
  card.id,
  {
    lineType: "row",
    position: 1,
  }
);

}catch (error) {
  console.error("Error using card:", error);
}

console.log(game.getPlayerHand("player1"));

console.log(
  "Board after removing row:",
  game.getBoard().getData()
);

game.placeSign("player1", 0, 0);
game.placeSign("player2", 0, 1);

const secondCard = game
  .getPlayerHand("player1")
  .find(
    (card) =>
      card.type === "REMOVE_ROW_COLUMN"
  );

if (!secondCard) {
  throw new Error(
    "Second Remove Row / Column card was not found"
  );
}

game.useCard(
  "player1",
  secondCard.id,
  {
    lineType: "column",
    position: 1,
  }
);

console.log(
  "Board after removing column:",
  game.getBoard().getData()
);

game.placeSign("player1", 1, 1);

const player2Card = game
  .getPlayerHand("player2")
  .find(
    (card) =>
      card.type === "REMOVE_ROW_COLUMN"
  );

if (!player2Card) {
  throw new Error(
    "Second Remove Row / Column card was not found"
  );
}

game.useCard(
  "player2",
  player2Card.id,
  {
    lineType: "column",
    position: 1,
  }
);