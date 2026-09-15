import { CardDeck } from "./CardDeck";
import { CardManager } from "./CardManager";
import { moveSignCard } from "./MoveSignCard";

const deck = new CardDeck();
const cardManager = new CardManager();

// Draw 5 cards
for (let i = 0; i < 5; i++) {
  cardManager.drawCard(deck);
}

console.log("Hand after 5 draws:");
console.dir(cardManager.getHand(), {
  depth: null,
});

console.log(
  "Hand size:",
  cardManager.getHandSize()
);

// Simulate a 6th card
cardManager.getHand().push({
  ...moveSignCard,
  id: "extra-card",
});

console.log("Hand after 6th card:");
console.dir(cardManager.getHand(), {
  depth: null,
});

console.log(
  "Needs discard:",
  cardManager.needsDiscard()
);

console.log(
  "Required discard count:",
  cardManager.getRequiredDiscardCount()
);

// Discard the extra card
cardManager.discardCard("extra-card");

console.log("Hand after discard:");
console.dir(cardManager.getHand(), {
  depth: null,
});

console.log(
  "Hand size:",
  cardManager.getHandSize()
);