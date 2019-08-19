import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../Utils";

export class CheckboxColumn {
  public constructor(
    public name: string,
    public cells: Array<CheckboxColumnCell>,
    public dataEqualsFn: (a: any, b: any) => boolean
  ) {}
}
export class CheckboxColumnCell {
  public constructor(
    public renderFn: () => JSX.Element,
    public data: any
  ) {}
}

export interface ICheckboxColumnsFlashCardMultiSelectProps {
  columns: Array<CheckboxColumn>;
  selectedCellDatas: Array<Array<any>>;
  onChange?: (newSelectedCellDatas: Array<Array<any>>) => void;
}
export interface ICheckboxColumnsFlashCardMultiSelectState {}
export class CheckboxColumnsFlashCardMultiSelect extends React.Component<ICheckboxColumnsFlashCardMultiSelectProps, ICheckboxColumnsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const columns = this.props.columns
      .map((column, columnIndex) => {
        const tableRows = column.cells
          .map((cell, cellIndex) => {
            const columnSelectedCellDatas = this.props.selectedCellDatas[columnIndex];
            const isChecked = columnSelectedCellDatas
              .find(scd => column.dataEqualsFn(cell.data, scd)) !== undefined;
            const isEnabled = !isChecked || (columnSelectedCellDatas.length > 1);

            return (
              <TableRow key={cellIndex}>
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    onChange={event => this.toggleCellEnabled(column, columnIndex, cell)}
                    disabled={!isEnabled}
                  />
                </TableCell>
                <TableCell>{cell.renderFn()}</TableCell>
              </TableRow>
            );
          }, this);
        const table = (
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{column.name}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        );
        return table;
      });

    return (
      <Grid container spacing={32}>
        {columns.map(c => <Grid item xs={4}>{c}</Grid>)}
      </Grid>
    );
  }

  private toggleCellEnabled(
    column: CheckboxColumn, columnIndex: number, cell: CheckboxColumnCell
  ) {
    if (!this.props.onChange) { return; }

    const newSelectedCellDatas = this.props.selectedCellDatas.slice();
    newSelectedCellDatas[columnIndex] = Utils.toggleArrayElementCustomEquals(
      newSelectedCellDatas[columnIndex], cell.data, column.dataEqualsFn
    );
    
    if (newSelectedCellDatas[columnIndex].length > 0) {
      this.props.onChange(newSelectedCellDatas);
    }
  }
}