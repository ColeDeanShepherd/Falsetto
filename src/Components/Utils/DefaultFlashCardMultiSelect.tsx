import * as React from "react";
import {
  Checkbox, Table, TableHead, TableBody, TableRow, TableCell, Button
} from "@material-ui/core";

import { FlashCard, FlashCardId } from "../../FlashCard";
import { renderFlashCardSide } from "../FlashCard";
import * as Utils from "../../Utils";
import { FlashCardLevel } from '../../FlashCardSet';

export interface IDefaultFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: any;
  flashCardLevels: Array<FlashCardLevel>;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export class DefaultFlashCardMultiSelect extends React.Component<IDefaultFlashCardMultiSelectProps, {}> {
  public static readonly FINAL_FLASH_CARD_LEVEL_NAME = "All";

  public render(): JSX.Element {
    const allFlashCardIds = this.props.flashCards.map(fc => fc.id);
    const levelButtons = (this.props.flashCardLevels.length > 0)
      ? (this.props.flashCardLevels
          .concat([new FlashCardLevel(DefaultFlashCardMultiSelect.FINAL_FLASH_CARD_LEVEL_NAME, allFlashCardIds)])
          .map((level, levelIndex) => {
            const style: any = { textTransform: "none" };
                    
            const isPressed = Utils.areArraysEqual(this.props.selectedFlashCardIds, level.flashCardIds);
            if (isPressed) {
              style.backgroundColor = "#959595";
            }

            return (
              <Button variant="contained" onClick={event => this.activateLevel(levelIndex)} style={style}>
                {level.name}
              </Button>
            );
          })
      ) : null;

    // TODO: calculate
    const flashCardSideWidth = 300;
    const flashCardSideHeight = 300;

    const flashCardCheckboxTableRows = this.props.flashCards
      .map(fc => {
        const isChecked = this.props.selectedFlashCardIds.indexOf(fc.id) >= 0;
        const isEnabled = !isChecked || (this.props.selectedFlashCardIds.length > 1);

        return (
          <TableRow key={fc.id}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleFlashCardEnabled(fc.id)} disabled={!isEnabled} /></TableCell>
            <TableCell>{renderFlashCardSide(flashCardSideWidth, flashCardSideHeight, fc.frontSide)}</TableCell>
            <TableCell>{renderFlashCardSide(flashCardSideWidth, flashCardSideHeight, fc.backSide)}</TableCell>
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
        <div>
          <span style={{ paddingRight: "1em" }}>Levels:</span>
          {levelButtons}
        </div>
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

    const newEnabledFlashCardIds = (levelIndex < this.props.flashCardLevels.length)
      ? this.props.flashCardLevels[levelIndex].flashCardIds.slice()
      : this.props.flashCards.map(fc => fc.id);
    this.props.onChange(newEnabledFlashCardIds, this.props.configData);
  }
}