import { CardDeck } from "../cards/CardDeck";

const deck = new CardDeck();

const results: Record<string, number> = {};

const DRAW_COUNT = 1000;

for (let i = 0; i < DRAW_COUNT; i++) {
  const card = deck.draw();

  results[card.type] =
    (results[card.type] ?? 0) + 1;
}

console.log("Results after", DRAW_COUNT, "draws:");
console.log(results);