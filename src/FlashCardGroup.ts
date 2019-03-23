import { FlashCard } from "./FlashCard";
import { AnswerDifficulty, StudyAlgorithm } from "./StudyAlgorithm";

export type RenderAnswerSelectFunc = (
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) => JSX.Element;

export type RenderFlashCardMultiSelectFunc = (
  selectedFlashCardIndices: number[],
  configData: any,
  onChange: (newValue: number[], newConfigData: any) => void
) => JSX.Element;

export class FlashCardGroup {
  public containerHeight: string = "240px";
  public initialSelectedFlashCardIndices: number[] | undefined;
  public initialConfigData: any;
  public renderFlashCardMultiSelect?: RenderFlashCardMultiSelectFunc;
  public renderAnswerSelect?: RenderAnswerSelectFunc;
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