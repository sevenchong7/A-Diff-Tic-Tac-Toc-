"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardDeck_1 = require("../cards/CardDeck");
const deck = new CardDeck_1.CardDeck();
const results = {};
const DRAW_COUNT = 1000;
for (let i = 0; i < DRAW_COUNT; i++) {
    const card = deck.draw();
    results[card.type] =
        (results[card.type] ?? 0) + 1;
}
console.log("Results after", DRAW_COUNT, "draws:");
console.log(results);
