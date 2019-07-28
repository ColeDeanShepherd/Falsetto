import * as React from "react";
import { Checkbox, Button } from "@material-ui/core";

import * as Utils from "../../Utils";

export interface IAnswerCheckboxesProps {
  answers: string[];
  selectAnswerId: (answerId: number) => void
}
export interface IAnswerCheckboxesState {
  checkedAnswerIndices: number[];
}
export class AnswerCheckboxes extends React.Component<IAnswerCheckboxesProps, IAnswerCheckboxesState> {
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
    const newCheckedAnswerIndices = Utils.toggleArrayElement(
      this.state.checkedAnswerIndices,
      answerIndex
    );

    this.setState({ checkedAnswerIndices: newCheckedAnswerIndices });
  }
}