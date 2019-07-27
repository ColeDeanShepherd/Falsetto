import { FlashCard } from "./FlashCard";
import { AnswerDifficulty, StudyAlgorithm } from "./StudyAlgorithm";

/*
- Every flash card has a front and a back.
- The two sides are related to one another.
- Usually the front side is a question and the back side is an answer
- So, at its simplest, a flash card is two render functions.
- But I want to have interactive exercises, to track your mastery of the concept
- So, I need some way of knowing whether the user got the flash card right or not
  - Maybe the user specifies it themselves
    - "I was correct" or "I was incorrect" buttons
  - Maybe there is a spectrum of right and wrong that the user can specify
    - "close-enough"
    - got it right, but it was hard to produce the answer
    - So, multiple buttons?
      - "flat-out wrong", "wrong, but only slightly", "right, but it was difficult", "mastered"
  - Maybe, instead of the user specifying their correctness, the computer determines it for them
    - Answer forms which know the correct answer
- In summary
  - Each flash card has
    - a front side render FN
    - a back side render FN
    - some kind of ID
    - some kind of answer form
      - which can be dependent on user config
  
- Now for flash card groups!
- Every flash card group has:
  - A name
  - A set of flash cards
    - And some way to configure them! (custom component probably)
  - Some free-form (ish) associated data
    - A link to learn more?
    - A description/README?
*/

export class RenderAnswerSelectArgs {
  public constructor(
    public width: number,
    public height: number,
    public flashCards: FlashCard[],
    public enabledFlashCardIds: number[],
    public configData: any,
    public areFlashCardsInverted: boolean,
    public currentFlashCardId: number,
    public currentFlashCard: FlashCard,
    public onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
    public lastCorrectAnswer: any,
    public incorrectAnswers: Array<any>
  ) {}
}

export type RenderAnswerSelectFunc = (state: RenderAnswerSelectArgs) => JSX.Element;

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