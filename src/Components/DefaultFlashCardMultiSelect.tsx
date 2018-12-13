import * as React from 'react';
import {
  Checkbox, Table, TableHead, TableBody, TableRow, TableCell
} from '@material-ui/core';

import { FlashCard } from "../FlashCard";
import { renderFlashCardSide } from "./FlashCard";
import * as Utils from "../Utils";

export interface IDefaultFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[]) => void;
}
export class DefaultFlashCardMultiSelect extends React.Component<IDefaultFlashCardMultiSelectProps, {}> {
  public render(): JSX.Element {
    const flashCardCheckboxTableRows = this.props.flashCards
      .map((fc, i) => {
        const isChecked = this.props.selectedFlashCardIndices.indexOf(i) >= 0;
        const isEnabled = !isChecked || (this.props.selectedFlashCardIndices.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleFlashCardEnabled(i)} disabled={!isEnabled} /></TableCell>
            <TableCell>{renderFlashCardSide(fc.frontSide)}</TableCell>
            <TableCell>{renderFlashCardSide(fc.backSide)}</TableCell>
          </TableRow >
        );
      }, this);
    const flashCardCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Front</TableCell>
            <TableCell>Back</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flashCardCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return <div>{flashCardCheckboxes}</div>;
  }

  private toggleFlashCardEnabled(flashCardIndex: number) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = Utils.toggleArrayElement(
      this.props.selectedFlashCardIndices,
      flashCardIndex
    );

    if (newEnabledFlashCardIndices.length > 0) {
      this.props.onChange(newEnabledFlashCardIndices);
    }
  }
}