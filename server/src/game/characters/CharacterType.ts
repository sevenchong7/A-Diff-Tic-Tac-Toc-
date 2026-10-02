export type CharacterType =
  | "DOUBLE_SKILL"
  | "DOUBLE_DRAW"
  | "BLOCK_LINE"
  | "CHANGE_OPPONENT_WIN_RULE"
  | "START_5X5"
  | "OPPONENT_5_SEC"
  | "DOUBLE_PLACEMENT";

export type CharacterState =
  | {
      type: "DOUBLE_SKILL";
      doubleSkillActive: boolean,
      doubleSkillActivationsRemaining: number;
    }
  | {
      type: "DOUBLE_DRAW";
      doubleDrawActive: boolean;
      doubleDrawActivationsRemaining: number;
    }
  | {
      type: "BLOCK_LINE";
      blockLineActivationsRemaining: number;
    }
  | {
      type: "CHANGE_OPPONENT_WIN_RULE";
    }
  | {
      type: "START_5X5";
    }
  | {
      type: "OPPONENT_5_SEC";
    }
  | {
      type: "DOUBLE_PLACEMENT";
      doublePlacementActivationsRemaining: number;
    };