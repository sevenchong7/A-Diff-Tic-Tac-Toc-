import { CardManager } from "./CardManager";
import { moveSignCard } from "./effects/MoveSignCard";

const cardManager = new CardManager();

// console.log("Initial hand:");
// console.dir(cardManager.getHand(), {
//   depth: null,
// });

// console.log("Adding card:");

// cardManager.addCard(moveSignCard);

// console.dir(cardManager.getHand(), {
//   depth: null,
// });

// console.log(
//   "Hand size:",
//   cardManager.getHandSize()
// );

// console.log("Removing card:");

// cardManager.removeCard(
//   "move-sign-horizontal"
// );

// console.dir(cardManager.getHand(), {
//   depth: null,
// });

// console.log(
//   "Hand size:",
//   cardManager.getHandSize()
// );

console.log("Testing hand limit:");

const limitedManager = new CardManager();

for (let i = 0; i < 5; i++) {
  limitedManager.addCard({
    ...moveSignCard,
    id: `move-sign-${i}`,
  });
}

console.log(
  "Hand size:",
  limitedManager.getHandSize()
);

try {
  limitedManager.addCard({
    ...moveSignCard,
    id: "sixth-card",
  });
} catch (error) {
  console.log(
    "Expected error:",
    (error as Error).message
  );
}