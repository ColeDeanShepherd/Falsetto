import * as React from 'react';
import { Checkbox, Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";

interface IAnswerCheckboxesProps {
  answers: string[];
  selectAnswerId: (answerId: number) => void
}
interface IAnswerCheckboxesState {
  checkedAnswerIndices: number[];
}
class AnswerCheckboxes extends React.Component<IAnswerCheckboxesProps, IAnswerCheckboxesState> {
  public constructor(props: IAnswerCheckboxesProps) {
    super(props);

    this.state = {
      checkedAnswerIndices: []
    };
  }
  public render(): JSX.Element {
    const answerCheckboxes = this.props.answers.map((answer, i) => {
      const isChecked = this.state.checkedAnswerIndices.indexOf(i) >= 0;

      return (
        <span key={i} style={{padding: "1em 1em 1em 0"}}>
          <Checkbox checked={isChecked} onChange={event => this.toggleAnswerChecked(i)} /> {answer}
        </span>
      );
    }, this);
    const answerId = Utils.setBitIndicesToInt(this.state.checkedAnswerIndices);

    return (
      <div style={{lineHeight: 3}}>
        {answerCheckboxes}
        <Button onClick={event => this.props.selectAnswerId(answerId)}>Submit Answer</Button>
      </div>
    );
  }
  
  private toggleAnswerChecked(answerIndex: number) {
    const newCheckedAnswerIndices = this.state.checkedAnswerIndices.slice();
    const i = newCheckedAnswerIndices.indexOf(answerIndex);
    const isAnswerChecked = i >= 0;

    if (!isAnswerChecked) {
      newCheckedAnswerIndices.push(answerIndex);
    } else {
      newCheckedAnswerIndices.splice(i, 1);
    }

    this.setState({ checkedAnswerIndices: newCheckedAnswerIndices });
  }
}

export function createQuiz(): Quiz {
  const intervalQualities = ["perfect", "imperfect"];
  const questionAnswers = [
    ["1st", "4th", "5th", "8th"],
    ["2nd", "3rd", "6th", "7th"]
  ];
  const answers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const questionAnswerIndices = intervalQualities
    .map((_, i) => {
      const setBitIndices = questionAnswers[i].map(qa => answers.indexOf(qa));
      return Utils.setBitIndicesToInt(setBitIndices);
    });

  return new Quiz(
    "Interval Qualities To Generic Intervals",
    intervalQualities.map(intervalQuality => (() => <span>{intervalQuality}</span>)),
    questionAnswerIndices,
    selectAnswerId => <AnswerCheckboxes answers={answers} selectAnswerId={selectAnswerId} />
  );
}