export type CardType =
  | "MOVE_SIGN_HORIZONTAL"
  | "MOVE_SIGN_VERTICAL"
  | "MOVE_ROW_COLUMN"
  | "BLOCK_CELL"
  ;

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
}