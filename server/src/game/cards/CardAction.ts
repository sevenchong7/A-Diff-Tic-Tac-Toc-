export interface CardAction {
  row?: number;
  column?: number;
  direction?: "left" | "right" | "up" | "down";

  lineType?: "row" | "column";
  position?: number;
}