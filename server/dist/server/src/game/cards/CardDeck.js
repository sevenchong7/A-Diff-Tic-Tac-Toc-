"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDeck = void 0;
const MoveSignCard_1 = require("./MoveSignCard");
const MoveSignVerticalCard_1 = require("./MoveSignVerticalCard");
const MoveRowColumnCard_1 = require("./MoveRowColumnCard");
const BlockCellCard_1 = require("./BlockCellCard");
const OpponentSkillLockCard_1 = require("./OpponentSkillLockCard");
const CARD_POOL = [
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
    {
        card: OpponentSkillLockCard_1.opponentSkillLockCard,
        weight: 10,
    },
];
class CardDeck {
    draw() {
        const totalWeight = CARD_POOL.reduce((total, entry) => total + entry.weight, 0);
        let randomValue = Math.random() * totalWeight;
        for (const entry of CARD_POOL) {
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
