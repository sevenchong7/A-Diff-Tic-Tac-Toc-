export type CardType =
  | "MOVE_SIGN_HORIZONTAL"
  | "MOVE_SIGN_VERTICAL"
  | "MOVE_ROW_COLUMN"
  | "BLOCK_CELL"
  | "OPPONENT_SKILL_LOCK"
  ;

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
}