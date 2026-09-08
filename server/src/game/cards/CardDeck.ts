import type { Card } from "./Card";
import { moveSignCard } from "./effects/MoveSignCard";

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
        id: "move-sign-2",
      },
      {
        ...moveSignCard,
        id: "move-sign-3",
      },
      {
        ...moveSignCard,
        id: "move-sign-4",
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