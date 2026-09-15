"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardDeck_1 = require("./CardDeck");
const CardManager_1 = require("./CardManager");
const MoveSignCard_1 = require("./MoveSignCard");
const deck = new CardDeck_1.CardDeck();
const cardManager = new CardManager_1.CardManager();
// Draw 5 cards
for (let i = 0; i < 5; i++) {
    cardManager.drawCard(deck);
}
console.log("Hand after 5 draws:");
console.dir(cardManager.getHand(), {
    depth: null,
});
console.log("Hand size:", cardManager.getHandSize());
// Simulate a 6th card
cardManager.getHand().push({
    ...MoveSignCard_1.moveSignCard,
    id: "extra-card",
});
console.log("Hand after 6th card:");
console.dir(cardManager.getHand(), {
    depth: null,
});
console.log("Needs discard:", cardManager.needsDiscard());
console.log("Required discard count:", cardManager.getRequiredDiscardCount());
// Discard the extra card
cardManager.discardCard("extra-card");
console.log("Hand after discard:");
console.dir(cardManager.getHand(), {
    depth: null,
});
console.log("Hand size:", cardManager.getHandSize());
