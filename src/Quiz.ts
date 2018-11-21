import * as Utils from "./Utils";

export class Quiz {
  public constructor(
    public name: string,
    public questionRenderFuncs: Array<() => JSX.Element>,
    public questionAnswerIndices: Array<number>,
    public answersRenderFunc: (selectAnswerId: (answerId: number) => void, questionId?: number) => JSX.Element
  ) {
    Utils.precondition(questionRenderFuncs.length === questionAnswerIndices.length);
  }
}