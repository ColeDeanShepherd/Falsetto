import * as Utils from "./Utils";

export class Quiz {
  public constructor(
    public name: string,
    public questionRenderFuncs: Array<() => JSX.Element>,
    public questionAnswerIndices: Array<number>,
    public answerRenderFunc: (questionId: number) => JSX.Element,
    public answerSelectorsRenderFunc: (selectAnswerId: (answerId: number) => void, questionId?: number) => JSX.Element
  ) {
    Utils.precondition(questionRenderFuncs.length === questionAnswerIndices.length);
  }
}