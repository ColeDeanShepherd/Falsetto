import { FlashCard } from "./FlashCard";
import { AnswerDifficulty, StudyAlgorithm } from "./StudyAlgorithm";

export class FlashCardGroup {
  public initialSelectedFlashCardIndices: number[] | undefined;
  public initialConfigData: any;
  public renderFlashCardMultiSelect?: (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ) => JSX.Element;
  public renderAnswerSelect?: (
    flashCards: FlashCard[],
    enabledFlashCardIndices: number[],
    areFlashCardsInverted: boolean,
    flashCard: FlashCard,
    onAnswer: (answerDifficulty: AnswerDifficulty) => void
  ) => JSX.Element;
  public enableInvertFlashCards: boolean = true;
  public moreInfoUri: string = "";
  public customNextFlashCardIdFilter?: (studyAlgorithm: StudyAlgorithm, enabledFlashCardIds: number[]) => number[];

  public get route(): string {
    return "/" + this.name.toLowerCase().replace(/( )|(\/)|(\\)/g, "-");
  }
  
  public constructor(
    public name: string,
    public flashCards: FlashCard[]
  ) {}
}