"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardManager = void 0;
const MAX_HAND_SIZE = 5;
class CardManager {
    hand = [];
    drawCard(deck) {
        const card = deck.draw();
        this.hand.push(card);
        return card;
    }
    needsDiscard() {
        return this.hand.length > MAX_HAND_SIZE;
    }
    getRequiredDiscardCount() {
        return Math.max(0, this.hand.length - MAX_HAND_SIZE);
    }
    discardCard(cardId) {
        this.removeCard(cardId);
    }
    addCard(card) {
        if (this.hand.length >= MAX_HAND_SIZE) {
            throw new Error("Hand is full");
        }
        this.hand.push(card);
    }
    removeCard(cardId) {
        const cardIndex = this.hand.findIndex((card) => card.id === cardId);
        if (cardIndex === -1) {
            throw new Error("Card not found in hand");
        }
        this.hand.splice(cardIndex, 1);
    }
    getHand() {
        return this.hand;
    }
    getHandSize() {
        return this.hand.length;
    }
}
exports.CardManager = CardManager;
