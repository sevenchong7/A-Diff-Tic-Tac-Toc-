export type CardType =
  | "MOVE_SIGN_HORIZONTAL"
  | "MOVE_SIGN_VERTICAL"
  | "MOVE_ROW_COLUMN"
  | "BLOCK_CELL"
  | "OPPONENT_SKILL_LOCK"
  | "INCREASE_OPPONENT_WIN_REQUIREMENT"
  | "ADD_ROW_COLUMN"
  | "DECREASE_OWN_WIN_REQUIREMENT"
  ;

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
}