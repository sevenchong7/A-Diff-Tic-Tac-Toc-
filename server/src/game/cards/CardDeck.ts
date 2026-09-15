import type { Card } from "./Card";
import { moveSignCard } from "./MoveSignCard";
import { moveSignVerticalCard } from "./MoveSignVerticalCard";
import { moveRowColumnCard } from "./MoveRowColumnCard";
import { blockCellCard } from "./BlockCellCard";

interface WeightedCard {
  card: Card;
  weight: number;
}

const CARD_POOL: WeightedCard[] = [
  {
    card: moveSignCard,
    weight: 25,
  },
  {
    card: moveSignVerticalCard,
    weight: 20,
  },
  {
    card: moveRowColumnCard,
    weight: 15,
  },
  {
    card: blockCellCard,
    weight: 10,
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