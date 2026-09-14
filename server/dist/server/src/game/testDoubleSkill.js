"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const game = new Game_1.Game("player1", "player2", 3, 3, 3);
game.getDoubleSkillActivationsRemaining("player1"); // Should return 3
console.log("Double Skill test started");
