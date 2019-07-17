import { FlashCard } from "./FlashCard";
import { AnswerDifficulty, StudyAlgorithm } from "./StudyAlgorithm";

export type RenderAnswerSelectFunc = (
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any,
  incorrectAnswers: Array<any>
) => JSX.Element;

export type RenderFlashCardMultiSelectFunc = (
  flashCards: Array<FlashCard>,
  selectedFlashCardIndices: number[],
  configData: any,
  onChange: (newValue: number[], newConfigData: any) => void
) => JSX.Element;

export type CustomNextFlashCardIdFilter = (
  studyAlgorithm: StudyAlgorithm,
  flashCards: Array<FlashCard>,
  enabledFlashCardIds: number[]
) => number[];

export class FlashCardGroup {
  public containerHeight: string = "240px";
  public initialSelectedFlashCardIndices: number[] | undefined;
  public initialConfigData: any;
  public renderFlashCardMultiSelect?: RenderFlashCardMultiSelectFunc;
  public renderAnswerSelect?: RenderAnswerSelectFunc;
  public enableInvertFlashCards: boolean = true;
  public moreInfoUri: string = "";
  public customNextFlashCardIdFilter?: CustomNextFlashCardIdFilter;

  public get route(): string {
    return "/" + this.name.toLowerCase().replace(/( )|(\/)|(\\)/g, "-");
  }
  
  public constructor(
    public name: string,
    public createFlashCards: () => FlashCard[]
  ) {}
}