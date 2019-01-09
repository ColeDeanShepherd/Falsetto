import * as React from 'react';
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { Pitch, pitchRange } from 'src/Pitch';
import { PitchLetter } from 'src/PitchLetter';
import { Chord } from 'src/Chord';
import { playPitch } from './PianoNotes';

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = pitchRange(minPitch, maxPitch, -1, 1);
const scales = [
  {
    type: "Ionian (Major)",
    formulaString: "1 2 3 4 5 6 7"
  },
  {
    type: "Dorian",
    formulaString: "1 2 b3 4 5 6 b7"
  },
  {
    type: "Phrygian",
    formulaString: "1 b2 b3 4 5 b6 b7"
  },
  {
    type: "Lydian",
    formulaString: "1 2 3 #4 5 6 7"
  },
  {
    type: "Mixolydian",
    formulaString: "1 2 3 4 5 6 b7"
  },
  {
    type: "Aeolian (Natural Minor)",
    formulaString: "1 2 b3 4 5 b6 b7"
  },
  {
    type: "Locrian",
    formulaString: "1 b2 b3 4 b5 b6 b7"
  },
  {
    type: "Melodic Minor",
    formulaString: "1 2 b3 4 5 6 7"
  },
  {
    type: "Dorian b2",
    formulaString: "1 b2 b3 4 5 6 b7"
  },
  {
    type: "Lydian Aug.",
    formulaString: "1 2 3 #4 #5 6 7"
  },
  {
    type: "Mixolydian #11",
    formulaString: "1 2 3 #4 5 6 b7"
  },
  {
    type: "Mixolydian b6",
    formulaString: "1 2 3 4 5 b6 b7"
  },
  {
    type: "Locrian Nat. 9",
    formulaString: "1 2 b3 4 b5 b6 b7"
  },
  {
    type: "Altered Dominant",
    formulaString: "1 b2 b3 b4 b5 b6 b7"
  },
  {
    type: "Harmonic Minor",
    formulaString: "1 2 b3 4 5 b6 7"
  },
  {
    type: "Locrian Nat. 6",
    formulaString: "1 b2 b3 4 b5 6 b7"
  },
  {
    type: "Ionian Aug.",
    formulaString: "1 2 3 4 #5 6 7"
  },
  {
    type: "Dorian #11",
    formulaString: "1 2 b3 #4 5 6 b7"
  },
  {
    type: "Phrygian Major",
    formulaString: "1 b2 3 4 5 b6 b7"
  },
  {
    type: "Lydian #9",
    formulaString: "1 #2 3 #4 5 6 7"
  },
  {
    type: "Altered Dominant bb7",
    formulaString: "1 b2 b3 b4 b5 b6 bb7"
  },
  {
    type: "Tonic Diminished",
    formulaString: "1 2 b3 4 b5 b6 bb7 7"
  },
  {
    type: "Dominant Diminished",
    formulaString: "1 b2 b3 b4 b5 5 6 b7"
  },
  {
    type: "Whole Tone",
    formulaString: "1 2 3 #4 #5 b7"
  },
  {
    type: "Augmented",
    formulaString: "1 #2 3 5 #5 7"
  },
  {
    type: "Major Pentatonic",
    formulaString: "1 2 3 5 6"
  },
  {
    type: "Minor Pentatonic",
    formulaString: "1 b3 4 5 b7"
  },
  {
    type: "Major Blues",
    formulaString: "1 2 b3 3 5 6"
  },
  {
    type: "Minor Blues",
    formulaString: "1 b3 4 b5 5 b7"
  }  
];

// TODO: instead of generating all flash cards ahead of time, dynamically generate each one

export interface IFlashCardFrontSideProps {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public componentDidMount() {
    for (let i = 0; i < this.props.pitches.length; i++) {
      setTimeout(() => playPitch(this.props.pitches[i]), 500 * i);
    }
  }

  public render(): JSX.Element {
    return <span>sound is playing</span>;
  }
}

interface IConfigData {
  enabledScaleTypes: string[];
}

export interface IScaleNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IScaleNotesFlashCardMultiSelectState {}
export class ScaleNotesFlashCardMultiSelect extends React.Component<IScaleNotesFlashCardMultiSelectProps, IScaleNotesFlashCardMultiSelectState> {
  public constructor(props: IScaleNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledScaleTypes: scales.map(c => c.type)
    };
  }
  public render(): JSX.Element {
    const scaleTypeCheckboxTableRows = scales
      .map((scale, i) => {
        const isChecked = this.props.configData.enabledScaleTypes.indexOf(scale.type) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledScaleTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleScaleEnabled(scale.type)} disabled={!isEnabled} /></TableCell>
            <TableCell>{scale.type}</TableCell>
          </TableRow>
        );
      }, this);
    const scaleTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Scale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scaleTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={12}>{scaleTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleScaleEnabled(scale: string) {
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      this.props.configData.enabledScaleTypes,
      scale
    );
    
    if (newEnabledScaleTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledScaleTypes: newEnabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = new Array<number>();

    let i = 0;

    for (const rootPitch of rootPitches) {
      for (const scale of scales) {
        const scaleType = scale.type;
        if (Utils.arrayContains(newConfigData.enabledScaleTypes, scaleType)) {
          newEnabledFlashCardIndices.push(i);
        }

        i++;
      }
    }

    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export function createFlashCardGroup(): FlashCardGroup {
  let i = 0;

  const flashCards = new Array<FlashCard>();

  for (const rootPitch of rootPitches) {
    for (const scale of scales) {
      const pitches = Chord.fromPitchAndFormulaString(rootPitch, scale.formulaString)
        .pitches;
      
      const iCopy = i;
      i++;

      flashCards.push(new FlashCard(
        () => <FlashCardFrontSide key={iCopy} pitches={pitches} />,
        scale.type
      ));
    }
  }

  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <ScaleNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledScaleTypes: scales.map(scale => scale.type)
  };
  
  const group = new FlashCardGroup(
    "Scale Ear Training",
    flashCards
  );
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderStringAnswerSelect.bind(
    null,
    scales.map(c => c.type),
    true
  );

  return group;
}