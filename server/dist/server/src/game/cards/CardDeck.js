"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDeck = void 0;
const MoveSignCard_1 = require("./effects/MoveSignCard");
const MoveSignVerticalCard_1 = require("./effects/MoveSignVerticalCard");
const MoveRowColumnCard_1 = require("./effects/MoveRowColumnCard");
class CardDeck {
    cards;
    constructor() {
        this.cards = [
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-1",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-2",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-3",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-4",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-5",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-6",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-7",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-8",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-9",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-10",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-11",
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: "move-sign-12",
            },
            {
                ...MoveSignVerticalCard_1.moveSignVerticalCard,
                id: "move-sign-vertical-1",
            },
            {
                ...MoveSignVerticalCard_1.moveSignVerticalCard,
                id: "move-sign-vertical-2",
            },
            {
                ...MoveSignVerticalCard_1.moveSignVerticalCard,
                id: "move-sign-vertical-3",
            },
            {
                ...MoveSignVerticalCard_1.moveSignVerticalCard,
                id: "move-sign-vertical-4",
            },
            {
                ...MoveSignVerticalCard_1.moveSignVerticalCard,
                id: "move-sign-vertical-5",
            },
            {
                ...MoveRowColumnCard_1.moveRowColumnCard,
                id: "move-row-column-1",
            },
            {
                ...MoveRowColumnCard_1.moveRowColumnCard,
                id: "move-row-column-2",
            },
            {
                ...MoveRowColumnCard_1.moveRowColumnCard,
                id: "move-row-column-3",
            },
            {
                ...MoveRowColumnCard_1.moveRowColumnCard,
                id: "move-row-column-4",
            },
            {
                ...MoveRowColumnCard_1.moveRowColumnCard,
                id: "move-row-column-5",
            },
        ];
    }
    resetDeck() {
        this.cards = [
            {
                ...MoveSignCard_1.moveSignCard,
                id: crypto.randomUUID(),
            },
            {
                ...MoveSignCard_1.moveSignCard,
                id: crypto.randomUUID(),
            },
            // more cards later
        ];
    }
    draw() {
        if (this.cards.length === 0) {
            this.resetDeck();
        }
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const [card] = this.cards.splice(randomIndex, 1);
        return card;
    }
    getRemainingCards() {
        return this.cards.length;
    }
}
exports.CardDeck = CardDeck;
