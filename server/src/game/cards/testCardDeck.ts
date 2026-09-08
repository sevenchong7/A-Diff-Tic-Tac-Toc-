import { CardDeck } from "./CardDeck";

const deck = new CardDeck();

console.log(
  "Cards in deck:",
  deck.getRemainingCards()
);

const card1 = deck.draw();

console.log("Drawn card 1:");
console.dir(card1, { depth: null });

console.log(
  "Cards remaining:",
  deck.getRemainingCards()
);

const card2 = deck.draw();

console.log("Drawn card 2:");
console.dir(card2, { depth: null });

console.log(
  "Cards remaining:",
  deck.getRemainingCards()
);