import { Board } from "./Board";
import { WinRule } from "./rules/WinRule";

interface GamePlayer {
  id: string;
  sign: "X" | "O";
}

export class Game {
  private board: Board;
  private players: GamePlayer[];

  private currentPlayerIndex: number;

  private status: "PLAYING" | "FINISHED" | "DRAW";

  private winRequirement: number;

  constructor(player1Id: string, player2Id: string) {
    this.board = new Board(3, 3);

    this.players = [
      {
        id: player1Id,
        sign: "X",
      },
      {
        id: player2Id,
        sign: "O",
      },
    ];

    this.currentPlayerIndex = 0;

    this.status = "PLAYING";

    this.winRequirement = 3;
  }

  private switchTurn(): void {
  this.currentPlayerIndex =
    this.currentPlayerIndex === 0 ? 1 : 0;
 }

 private isBoardFull(): boolean {
  const board = this.board.getData();

  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.sign === null) {
        return false;
      }
    }
  }

  return true;
}


public placeSign(
  playerId: string,
  row: number,
  column: number
): void {
  if (this.status !== "PLAYING") {
    throw new Error("Game is not currently playing");
  }

  const currentPlayer = this.players[this.currentPlayerIndex];

  if (currentPlayer.id !== playerId) {
    throw new Error("It is not your turn");
  }

  this.board.placeSign(
    row,
    column,
    currentPlayer.sign
  );

  const hasWon = WinRule.hasWon(
    this.board,
    currentPlayer.sign,
    this.winRequirement
  );

  if (hasWon) {
    this.status = "FINISHED";

    console.log(
      `Player ${currentPlayer.id} (${currentPlayer.sign}) wins!`
    );

    return;
  }

  if (this.isBoardFull()) {
    this.status = "DRAW";

    console.log("Game ended in a draw!");

    return;
  }

  this.switchTurn();
}

public getBoard(): ReturnType<Board["getData"]> {
  return this.board.getData();
}

public getCurrentPlayer(): GamePlayer {
  return this.players[this.currentPlayerIndex];
}

public getStatus(): "PLAYING" | "FINISHED" | "DRAW" {
  return this.status;
}

}