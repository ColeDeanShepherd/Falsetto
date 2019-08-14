import { FlashCard, FlashCardId } from "./FlashCard";
import { StudyAlgorithm } from "./StudyAlgorithm";
import { AnswerDifficulty } from "./AnswerDifficulty";

export class RenderAnswerSelectArgs {
  public constructor(
    public width: number,
    public height: number,
    public flashCards: FlashCard[],
    public enabledFlashCardIds: Array<FlashCardId>,
    public configData: any,
    public areFlashCardsInverted: boolean,
    public currentFlashCardId: FlashCardId,
    public currentFlashCard: FlashCard,
    public onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
    public lastCorrectAnswer: any,
    public incorrectAnswers: Array<any>
  ) {}
}

export type RenderAnswerSelectFunc = (state: RenderAnswerSelectArgs) => JSX.Element;

export type RenderFlashCardMultiSelectFunc = (
  flashCards: Array<FlashCard>,
  selectedFlashCardIds: Array<FlashCardId>,
  configData: any,
  onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
) => JSX.Element;

export type CustomNextFlashCardIdFilter = (
  studyAlgorithm: StudyAlgorithm,
  flashCards: Array<FlashCard>,
  enabledFlashCardIds: Array<FlashCardId>
) => Array<FlashCardId>;

export class FlashCardLevel {
  public constructor(
    public name: string,
    public flashCardIds: Array<FlashCardId>
  ) {}
}

export class FlashCardSet {
  public containerHeight: string = "240px";
  public initialSelectedFlashCardIds: Array<FlashCardId> | undefined;
  public initialConfigData: any;
  public renderFlashCardMultiSelect?: RenderFlashCardMultiSelectFunc;
  public renderAnswerSelect?: RenderAnswerSelectFunc;
  public enableInvertFlashCards: boolean = true;
  public moreInfoUri: string = "";
  public customNextFlashCardIdFilter?: CustomNextFlashCardIdFilter;
  public createFlashCardLevels?: (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => Array<FlashCardLevel>;

  public get route(): string {
    return "/" + this.name.toLowerCase().replace(/( )|(\/)|(\\)/g, "-");
  }
  
  public constructor(
    public id: string,
    public name: string,
    public createFlashCards: () => FlashCard[]
  ) {}
}