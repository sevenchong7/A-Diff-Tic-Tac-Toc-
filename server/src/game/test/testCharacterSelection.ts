import { Game } from "../Game";

const game = new Game(
  "player1",
  "player2",
  3,
  3,
  3
);

// console.log(
//   "Player 1 character:",
//   game.getPlayerCharacter("player1")
// );

// console.log(
//   "Player 2 character:",
//   game.getPlayerCharacter("player2")
// );

console.log("\nPlayer 1 selects DOUBLE_PLACEMENT");

game.selectCharacter(
  "player1",
  "DOUBLE_PLACEMENT"
);

console.log(
  "Player 1 character:",
  game.getPlayerCharacter("player1")
);


console.log("\nPlayer 2 selects DOUBLE_SKILL");

game.selectCharacter(
  "player2",
  "DOUBLE_SKILL"
);

console.log(
  "Player 2 character:",
  game.getPlayerCharacter("player2")
);


console.log(
  "\nPlayer 1 activates Double Placement"
);

game.activateDoublePlacement("player1");

console.log(
  "Double Placement activations remaining:",
  game.getDoublePlacementActivationsRemaining(
    "player1"
  )
);

console.log(
  "Placements remaining:",
  game.getPlacementsRemaining()
);

game.placeSign("player1", 0, 0);

console.log(
  "Placements remaining:",
  game.getPlacementsRemaining()
);

game.placeSign("player1", 1, 1);

console.log(
  "Placements remaining:",
  game.getPlacementsRemaining()
);