import type { Card } from "./Card";
import { moveSignCard } from "./MoveSignCard";
import { moveSignVerticalCard } from "./MoveSignVerticalCard";
import { moveRowColumnCard } from "./MoveRowColumnCard";
import { blockCellCard } from "./BlockCellCard";

export class CardDeck {
  private cards: Card[];

  constructor() {
    this.cards = [
      {
        ...moveSignCard,
        id: "move-sign-1",
      },
      {
        ...moveSignCard,
        id: "move-sign-1",
      },
      {
        ...moveSignCard,
        id: "move-sign-1",
      },
      {
        ...moveSignCard,
        id: "move-sign-1",
      },
      {
        ...moveSignCard,
        id: "move-sign-5",
      },
       {
        ...moveSignCard,
        id: "move-sign-6",
      },
       {
        ...moveSignCard,
        id: "move-sign-7",
      },
       {
        ...moveSignCard,
        id: "move-sign-8",
      },
       {
        ...moveSignCard,
        id: "move-sign-9",
      },
       {
        ...moveSignCard,
        id: "move-sign-10",
      },
       {
        ...moveSignCard,
        id: "move-sign-11",
      },
       {
        ...moveSignCard,
        id: "move-sign-12",
      },
      {
        ...moveSignVerticalCard,
        id: "move-sign-vertical-1",
      },
      {
        ...moveSignVerticalCard,
        id: "move-sign-vertical-2",
      },
      {
        ...moveSignVerticalCard,
        id: "move-sign-vertical-3",
      },
      {
        ...moveSignVerticalCard,
        id: "move-sign-vertical-4",
      },
      {
        ...moveSignVerticalCard,
        id: "move-sign-vertical-5",
      },
      {
        ...moveRowColumnCard,
        id: "move-row-column-1",
      },
      {
        ...moveRowColumnCard,
        id: "move-row-column-2",
      },
      {
        ...moveRowColumnCard,
        id: "move-row-column-3",
      },
      {
        ...moveRowColumnCard,
        id: "move-row-column-4",
      },
      {
        ...moveRowColumnCard,
        id: "move-row-column-5",
      },
      {
        ...blockCellCard,
        id: "block-cell-1",
      },
      {
        ...blockCellCard,
        id: "block-cell-2",
      },
      {
        ...blockCellCard,
        id: "block-cell-3",
      },
      {
        ...blockCellCard,
        id: "block-cell-4",
      },
      {
        ...blockCellCard,
        id: "block-cell-5",
      },
    ];
  }


  private resetDeck(): void {
    this.cards = [
      {
        ...moveSignCard,
        id: crypto.randomUUID(),
      },
      {
        ...moveSignCard,
        id: crypto.randomUUID(),
      },
      // more cards later
    ];
  }

  public draw(): Card {
    if (this.cards.length === 0) {
      this.resetDeck();
    }

    const randomIndex = Math.floor(
      Math.random() * this.cards.length
    );

    const [card] = this.cards.splice(randomIndex, 1);

    return card;
  }

  public getRemainingCards(): number {
    return this.cards.length;
  }
}