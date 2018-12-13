import { FlashCard } from "./FlashCard";

export class FlashCardGroup {
  public constructor(
    public name: string,
    public flashCards: FlashCard[],
    public renderFlashCardMultiSelect?: (selectedFlashCardIndices: number[], onChange: (newValue: number[]) => void) => JSX.Element
  ) {}
}