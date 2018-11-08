export class Quiz {
  public constructor(
    public questionRenderFuncs: Array<() => JSX.Element>,
    public answersRenderFunc: (selectAnswerIndex: (answerIndex: number) => void) => JSX.Element
  ) {}
}