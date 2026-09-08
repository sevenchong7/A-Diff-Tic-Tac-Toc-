export type CardType =
  | "MOVE_SIGN_HORIZONTAL";

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
}