import type { Card } from "./Card";
import { CardDeck } from "./CardDeck";

const MAX_HAND_SIZE = 5;

export class CardManager {
  private hand: Card[] = [];

  public drawCard(deck: CardDeck): Card {
    const card = deck.draw();

    this.hand.push(card);

    return card;
  }

  public needsDiscard(): boolean {
    return this.hand.length > MAX_HAND_SIZE;
  }

  public getRequiredDiscardCount(): number {
    return Math.max(
      0,
      this.hand.length - MAX_HAND_SIZE
    );
  }

  public discardCard(cardId: string): void {
    this.removeCard(cardId);
  }

  public addCard(card: Card): void {
    if (this.hand.length >= MAX_HAND_SIZE) {
      throw new Error("Hand is full");
    }

    this.hand.push(card);
  }

  public removeCard(cardId: string): void {
    const cardIndex = this.hand.findIndex(
      (card) => card.id === cardId
    );

    if (cardIndex === -1) {
      throw new Error("Card not found in hand");
    }

    this.hand.splice(cardIndex, 1);
  }

  public getHand(): Card[] {
    return this.hand;
  }

  public getHandSize(): number {
    return this.hand.length;
  }
}