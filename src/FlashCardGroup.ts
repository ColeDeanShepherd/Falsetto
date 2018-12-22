import { FlashCard } from "./FlashCard";

export class FlashCardGroup {
  public renderFlashCardMultiSelect?: (selectedFlashCardIndices: number[], onChange: (newValue: number[]) => void) => JSX.Element;
  public enableInvertFlashCards: boolean = true;
  
  public constructor(
    public name: string,
    public flashCards: FlashCard[]
  ) {}
}