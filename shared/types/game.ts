export type Sign = "X" | "O";

export interface Cell {
    sign: Sign | null;
    blocked: boolean;
}

export interface Board {
    rows: number;
    columns: number;
    cells: Cell[][];
}

export type GameStatus = 
| "DRAW"
| "WAITTING"
| "RPS"
| "CHARACTER_SELECT"
| "PLAYING"
| "FINISHED";

export interface GamePlayerState {
  id: string;
  sign: Sign;
  character: string | null;
  winRequirement: number;
  cards: {
    id: string;
    type: string;
    name: string;
    description: string;
  }[];
}

export interface GameState {
  status: GameStatus;
  board: Board;
  players: GamePlayerState[];
  currentPlayerId: string | null;
}