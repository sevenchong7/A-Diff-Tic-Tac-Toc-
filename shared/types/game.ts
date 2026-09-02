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
| "WAITTING"
| "RPS"
| "CHARACTER_SELECT"
| "PLAYING"
| "FINISHED";

