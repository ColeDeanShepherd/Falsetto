import * as React from "react";
import {
  Checkbox, Table, TableHead, TableBody, TableRow, TableCell, Button
} from "@material-ui/core";

import { FlashCard, FlashCardId } from "../../FlashCard";
import { renderFlashCardSide } from "../FlashCard";
import * as Utils from "../../lib/Core/Utils";
import { Size2D } from '../../lib/Core/Size2D';
import { toggleArrayElement } from '../../lib/Core/ArrayUtils';

export interface IDefaultFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: any;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export class DefaultFlashCardMultiSelect extends React.Component<IDefaultFlashCardMultiSelectProps, {}> {
  public render(): JSX.Element {
    // TODO: calculate
    const flashCardSideSize = new Size2D(300, 300);

    const flashCardCheckboxTableRows = this.props.flashCards
      .map(fc => {
        const isChecked = this.props.selectedFlashCardIds.indexOf(fc.id) >= 0;
        const isEnabled = !isChecked || (this.props.selectedFlashCardIds.length > 1);

        return (
          <TableRow key={fc.id}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleFlashCardEnabled(fc.id)} disabled={!isEnabled} /></TableCell>
            <TableCell>{renderFlashCardSide(flashCardSideSize, fc.frontSide)}</TableCell>
            <TableCell>{renderFlashCardSide(flashCardSideSize, fc.backSide)}</TableCell>
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

    return flashCardCheckboxes;
  }

  private toggleFlashCardEnabled(flashCardId: string) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = toggleArrayElement(
      this.props.selectedFlashCardIds,
      flashCardId
    );

    if (newEnabledFlashCardIds.length > 0) {
      this.props.onChange(newEnabledFlashCardIds, this.props.configData);
    }
  }
}