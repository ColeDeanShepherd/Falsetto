import * as React from "react";
import {
  Checkbox, Table, TableHead, TableBody, TableRow, TableCell, Button
} from "@material-ui/core";

import { FlashCard, FlashCardId } from "../../FlashCard";
import { renderFlashCardSide } from "../FlashCard";
import * as Utils from "../../Utils";
import { FlashCardLevel } from '../../FlashCardSet';
import { Size2D } from '../../Size2D';

export interface IDefaultFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: any;
  flashCardLevels: Array<FlashCardLevel>;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export class DefaultFlashCardMultiSelect extends React.Component<IDefaultFlashCardMultiSelectProps, {}> {
  public render(): JSX.Element {
    const levelButtons = (this.props.flashCardLevels.length > 0)
      ? (this.props.flashCardLevels
          .map((level, levelIndex) => {
            const style: any = { textTransform: "none" };
                    
            const isPressed = Utils.areArraysEqual(this.props.selectedFlashCardIds, level.flashCardIds);
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button variant="contained" onClick={event => this.activateLevel(levelIndex)} style={style}>
                {1 + levelIndex}. {level.name}
              </Button>
            );
          })
      ) : null;

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

    return (
      <div>
        {(this.props.flashCardLevels.length > 0) ? (
          <div>
            <span style={{ paddingRight: "1em" }}>Levels:</span>
            {levelButtons}
          </div>
        ) : null}
        {flashCardCheckboxes}
      </div>
    );
  }

  private toggleFlashCardEnabled(flashCardId: string) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = Utils.toggleArrayElement(
      this.props.selectedFlashCardIds,
      flashCardId
    );

    if (newEnabledFlashCardIds.length > 0) {
      this.props.onChange(newEnabledFlashCardIds, this.props.configData);
    }
  }
  private activateLevel(levelIndex: number) {
    if (!this.props.onChange) { return; }

    const level = this.props.flashCardLevels[levelIndex];
    const newEnabledFlashCardIds = level.flashCardIds.slice();
    this.props.onChange(newEnabledFlashCardIds, this.props.configData);
  }
}