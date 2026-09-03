import { Game } from "./Game";

// const game = new Game("Alice", "Bob", 2, 3, 3);

const game = new Game(
  "Alice",
  "Bob",
  5,
  5,
  4
);



console.log("Current player:");
console.log(game.getCurrentPlayer());

game.placeSign("Alice", 0, 0);

console.log("After Alice:");
console.dir(game.getBoard(), { depth: null });

console.log("Current player:");
console.log(game.getCurrentPlayer());

game.placeSign("Bob", 1, 0);

game.placeSign("Alice", 0, 1);

game.placeSign("Bob", 1, 1);

game.placeSign("Alice", 0, 2);
game.placeSign("Bob", 1, 2);

game.placeSign("Alice", 0, 3);

console.log("Final status:");
console.log(game.getStatus());