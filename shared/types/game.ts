import type { CharacterState } from "../../server/src/game/characters/CharacterType";

export type Sign = "X" | "O";

export interface Cell {
    sign: Sign | null;
    blocked: boolean;
    blockedByPlayerId: string | null;
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
  character: CharacterState | null;
  winRequirement: number;
  cards: {
    id: string;
    type: string;
    name: string;
    description: string;
  }[];
  needsDiscard: boolean;
  skillLocked: boolean;
}

export interface BlockedLine {
  type: "row" | "column";
  index: number;
  remainingTurns: number;
  blockedByPlayerId: string;
}

export interface GameState {
  status: GameStatus;
  board: Board;
  players: GamePlayerState[];
  currentPlayerId: string | null;
  blockedLines: BlockedLine[];
}