import { precondition } from "./Utils";

export class Quiz {
  public constructor(
    public name: string,
    public questionRenderFuncs: Array<() => JSX.Element>,
    public questionAnswerIndices: Array<number>,
    public answersRenderFunc: (selectAnswerIndex: (answerIndex: number) => void) => JSX.Element
  ) {
    precondition(questionRenderFuncs.length === questionAnswerIndices.length);
  }
}