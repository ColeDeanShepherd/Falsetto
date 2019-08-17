import { FlashCard, FlashCardId } from "./FlashCard";
import { StudyAlgorithm } from "./StudyAlgorithm";
import { AnswerDifficulty } from "./AnswerDifficulty";

export class FlashCardStudySessionInfo {
  public constructor(
    public width: number,
    public height: number,
    public flashCardSet: FlashCardSet,
    public flashCards: FlashCard[],
    public enabledFlashCardIds: Array<FlashCardId>,
    public configData: any,
    public currentFlashCardId: FlashCardId,
    public currentFlashCard: FlashCard,
    public onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
    public lastCorrectAnswer: any,
    public incorrectAnswers: Array<any>,
    public studyAlgorithm: StudyAlgorithm
  ) {}
}

export type ConfigDataToEnabledFlashCardIdsFunc = (info: FlashCardStudySessionInfo, configData: any) => Array<FlashCardId>;

export type RenderAnswerSelectFunc = (info: FlashCardStudySessionInfo) => JSX.Element;

export type RenderFlashCardMultiSelectFunc = (
  info: FlashCardStudySessionInfo,
  onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
) => JSX.Element;

export type CustomNextFlashCardIdFilter = (info: FlashCardStudySessionInfo) => Array<FlashCardId>;

export class FlashCardLevel {
  public constructor(
    public name: string,
    public flashCardIds: Array<FlashCardId>
  ) {}
}

export class FlashCardSet {
  public containerHeight: string = "240px";
  public initialConfigData: any;
  public configDataToEnabledFlashCardIds: ConfigDataToEnabledFlashCardIdsFunc | undefined;
  public renderFlashCardMultiSelect?: RenderFlashCardMultiSelectFunc;
  public renderAnswerSelect?: RenderAnswerSelectFunc;
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