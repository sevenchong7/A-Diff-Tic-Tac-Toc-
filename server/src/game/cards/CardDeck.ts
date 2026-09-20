import type { Card } from "./Card";
import { moveSignCard } from "./MoveSignCard";
import { moveSignVerticalCard } from "./MoveSignVerticalCard";
import { moveRowColumnCard } from "./MoveRowColumnCard";
import { blockCellCard } from "./BlockCellCard";
import { opponentSkillLockCard } from "./OpponentSkillLockCard";
import { increaseOpponentWinRequirementCard } from "./IncreaseOpponentWinRequirementCard";
import { decreaseOwnWinRequirementCard } from "./DecreaseOwnWinRequirementCard";
import { addRowColumnCard } from "./AddRowColumnCard";
import { removeOpponentSignCard } from "./RemoveOpponentSignCard";
import { removeRowColumnCard } from "./RemoveRowColumnCard";

interface WeightedCard {
  card: Card;
  weight: number;
}

const CARD_POOL: WeightedCard[] = [
  {
    card: moveSignCard,
    weight: 1,
  },
  {
    card: moveSignVerticalCard,
    weight: 1,
  },
  {
    card: moveRowColumnCard,
    weight: 1,
  },
  {
    card: blockCellCard,
    weight: 1,
  },
  {
    card: opponentSkillLockCard,
    weight: 1,
  },
  {
    card: increaseOpponentWinRequirementCard,
    weight: 1,
  },
  {
    card: decreaseOwnWinRequirementCard,
    weight: 1,
  },
  {
    card: addRowColumnCard,
    weight: 40,
  },
    {
    card: removeRowColumnCard,
    weight: 40,
  },
  {
    card: removeOpponentSignCard,
    weight: 1,
  },

];

export class CardDeck {
  public draw(): Card {
    const totalWeight = CARD_POOL.reduce(
      (total, entry) => total + entry.weight,
      0
    );

    let randomValue = Math.random() * totalWeight;

    for (const entry of CARD_POOL) {
      randomValue -= entry.weight;

      if (randomValue < 0) {
        return {
          ...entry.card,
          id: crypto.randomUUID(),
        };
      }
    }

    throw new Error("Failed to draw card");
  }
}