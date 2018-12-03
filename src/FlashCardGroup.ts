import { FlashCard } from "./FlashCard";

export class FlashCardGroup {
  public constructor(
    public name: string,
    public flashCards: FlashCard[]
  ) {}
}