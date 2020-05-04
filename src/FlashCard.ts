import { Size2D } from './lib/Core/Size2D';
import { RenderAnswerSelectFunc } from './FlashCardSet';
import { renderUserDeterminedCorrectnessAnswerSelect } from "./Components/Quizzes/Utils";

export type FlashCardId = string;

export class FlashCard {
  public static fromRenderFns(
    id: FlashCardId,
    frontSideRenderFn: FlashCardSideRenderFn,
    backSideRenderFn: FlashCardSideRenderFn,
    renderAnswerSelectFn?: RenderAnswerSelectFunc
  ): FlashCard {
    return new FlashCard(
      id,
      new FlashCardSide(frontSideRenderFn),
      new FlashCardSide(backSideRenderFn),
      renderAnswerSelectFn
    );
  }

  public constructor(
    public id: FlashCardId,
    public frontSide: FlashCardSide,
    public backSide: FlashCardSide,
    public renderAnswerSelectFn?: RenderAnswerSelectFunc
  ) {}

  public get doesUserDetermineCorrectness(): boolean {
    return this.renderAnswerSelectFn === renderUserDeterminedCorrectnessAnswerSelect;
  }
}

export type FlashCardSideRenderFn = string | ((size: Size2D) => JSX.Element);

export class FlashCardSide {
  public constructor(
    public renderFn: FlashCardSideRenderFn,
    public data: any = null
  ) {}
}