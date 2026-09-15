"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDeck = void 0;
const MoveSignCard_1 = require("./MoveSignCard");
const MoveSignVerticalCard_1 = require("./MoveSignVerticalCard");
const MoveRowColumnCard_1 = require("./MoveRowColumnCard");
const BlockCellCard_1 = require("./BlockCellCard");
class CardDeck {
    cardPool;
    constructor() {
        this.cardPool = [
            {
                card: MoveSignCard_1.moveSignCard,
                weight: 25,
            },
            {
                card: MoveSignVerticalCard_1.moveSignVerticalCard,
                weight: 20,
            },
            {
                card: MoveRowColumnCard_1.moveRowColumnCard,
                weight: 15,
            },
            {
                card: BlockCellCard_1.blockCellCard,
                weight: 10,
            },
        ];
    }
    draw() {
        const totalWeight = this.cardPool.reduce((total, entry) => total + entry.weight, 0);
        let randomValue = Math.random() * totalWeight;
        for (const entry of this.cardPool) {
            randomValue -= entry.weight;
            if (randomValue < 0) {
                return {
                    ...entry.card,
                    id: crypto.randomUUID(),
                };
            }
        }
        throw new Error("Failed to draw card");
    }
}
exports.CardDeck = CardDeck;
