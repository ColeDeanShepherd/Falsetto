import * as React from "react";
import { Card } from "../Card/Card";
import { Pitch, cPitchClass } from '../../lib/TheoryLib/Pitch';
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { fromBitMask, generateAllCanonicalChordBitMasks, CanonicalChord, getPitches } from '../../lib/TheoryLib/CanonicalChord';
import { chordTypeByCanonicalChordTypeBitMask } from "../../lib/TheoryLib/Analysis";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";

interface TableRowData {
  pitches: Array<Pitch>;
  chordType: ChordType;
}

const pitchOctaveNumber = 4;

function generateTableData(): Array<TableRowData> {
  return [...generateAllCanonicalChordBitMasks()]
    .map(bitMask => {
      const canonicalChordType = fromBitMask(bitMask);
      const canonicalChord: CanonicalChord = {
        type: canonicalChordType,
        rootPitchClass: cPitchClass
      };
      
      return {
        pitches: getPitches(canonicalChord, pitchOctaveNumber),
        chordType: chordTypeByCanonicalChordTypeBitMask[bitMask]
      } as TableRowData;
    });
}

export class AllNotesIntervalsChordsScales extends React.Component<{}, {}> {
  public componentDidMount() {
    this.tableData = generateTableData();
    this.forceUpdate();
  }

  public render(): JSX.Element {
    return (
      <Card>
        <h2 className="margin-bottom">
          All Notes, Intervals, Chords, &amp; Scales
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Notes</th>
              <th>Chord Names</th>
            </tr>
          </thead>
          <tbody>
            {this.tableData.map(trd => (
              <tr>
                <td>
                  <PianoKeyboard
                    maxWidth={200}
                    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
                    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
                    pressedPitches={trd.pitches} />
                </td>
                <td>{trd.chordType ? trd.chordType.name : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  private tableData = new Array<TableRowData>();
}