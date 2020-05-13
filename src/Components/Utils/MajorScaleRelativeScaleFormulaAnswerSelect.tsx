import * as React from "react";

import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { range } from '../../lib/Core/MathUtils';
import { SignedAccidental } from '../../lib/TheoryLib/Pitch';
import { MajorScaleRelativeFormulaAnswerSelect } from './MajorScaleRelativeFormulaAnswerSelect';

const scaleDegreeCount = 7;
const scaleDegreeNumbers = range(1, scaleDegreeCount);

export interface IMajorScaleRelativeScaleFormulaAnswerSelectProps {
  info: FlashCardStudySessionInfo
  correctAnswer: Array<SignedAccidental>;
}
export class MajorScaleRelativeScaleFormulaAnswerSelect extends React.Component<IMajorScaleRelativeScaleFormulaAnswerSelectProps, {}> {
  public render(): JSX.Element {
    const { info, correctAnswer } = this.props;

    return <MajorScaleRelativeFormulaAnswerSelect
    info={info}
    correctAnswer={correctAnswer}
    scaleDegreeNumbers={scaleDegreeNumbers} />;
  }
}