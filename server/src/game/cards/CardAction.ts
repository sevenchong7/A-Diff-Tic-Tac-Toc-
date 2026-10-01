export interface CardAction {
  row?: number;
  column?: number;
  direction?: "left" | "right" | "up" | "down" | null;

  lineType?: "row" | "column";
  position?: number;
}