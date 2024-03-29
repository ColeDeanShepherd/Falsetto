import * as React from "react";
import { Checkbox } from "@material-ui/core";
import Vex from "vexflow";

import * as FlashCardUtils from "../Utils";
import { VexFlowComponent } from "../../Utils/VexFlowComponent";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Size2D } from '../../../lib/Core/Size2D';
import { range } from '../../../lib/Core/MathUtils';

const flashCardSetId = "sheetMusicNotes";

const clefs = [
  {
    name: "treble",
    bottomLinePitch: new Pitch(PitchLetter.E, 0, 4)
  },
  {
    name: "bass",
    bottomLinePitch: new Pitch(PitchLetter.G, 0, 2)
  }
];

function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <SheetMusicNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  }

  const flashCardSet = new FlashCardSet(flashCardSetId, "Sheet Music Notes", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    isTrebleClefEnabled: true,
    isBassClefEnabled: true,
    areAccidentalsEnabled: false
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderNoteAnswerSelect;
  flashCardSet.moreInfoUri = "https://www.joytunes.com/blog/music-fun/best-way-memorize-piano-notes/";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return allPitchesMap((clef, pitch) => {
    const pitchAccidentalString = pitch.getAccidentalString();
    const pitchAccidentalSymbolString = pitch.getAccidentalString(true);
    const vexFlowPitchString = pitch.toVexFlowString();
    
    const isTrebleNote = (clef === "treble");
    const trebleNotes = [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: isTrebleNote ? [vexFlowPitchString] : ["b/4"],
        duration: isTrebleNote ? "w" : "wr"
      })
    ];
    const bassNotes = [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: !isTrebleNote ? [vexFlowPitchString] : ["d/3"],
        duration: !isTrebleNote ? "w" : "wr"
      })
    ];

    if (pitch.signedAccidental !== 0) {
      if (isTrebleNote) {
        for (const note of trebleNotes) {
          note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
        }
      } else {
        for (const note of bassNotes) {
          note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
        }
      }
    }

    return FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { clef: clef, pitch: pitch.toString(true) }),
      () => (  
        <SheetMusicSingleNote
          size={new Size2D(150, 200)}
          trebleNotes={trebleNotes}
          bassNotes={bassNotes}
        />
      ),
      `${PitchLetter[pitch.letter]}${pitchAccidentalSymbolString}`
    );
  });
}
export function allPitchesMap<TResult>(mapFn: (clef: string, pitch: Pitch, index: number) => TResult): Array<TResult> {
  const result = new Array<TResult>();

  let i = 0;
  clefs.forEach(clef => {
    range(0, 20).forEach(pitchLetterOffset => {
      range(-1, 1).forEach(signedAccidental => {
        const pitch = Pitch.addPitchLetters(clef.bottomLinePitch, -6 + pitchLetterOffset);
        pitch.signedAccidental = signedAccidental;
        
        result.push(mapFn(clef.name, pitch, i));
        i++;
      })
    });
  });

  return result;
}
function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const enabledFlashCardIds = new Array<FlashCardId>();

  allPitchesMap((clef, pitch, i) => {
    if (!configData.isTrebleClefEnabled && (clef === "treble")) {
      return;
    }
    
    if (!configData.isBassClefEnabled && (clef === "bass")) {
      return;
    }

    if (!configData.areAccidentalsEnabled && (pitch.signedAccidental !== 0)) {
      return;
    }

    enabledFlashCardIds.push(flashCards[i].id);
  });

  return enabledFlashCardIds;
}
export function renderNoteAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const sharpNotes = ["A♯", "B♯", "C♯", "D♯", "E♯", "F♯", "G♯"];
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const flatNotes = ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"];
  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.0`, sharpNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.1`, naturalNotes, info
      )}
      {FlashCardUtils.renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.2`, flatNotes, info
      )}
    </div>
  );
}

export interface ISheetMusicSingleNoteProps {
  size: Size2D;
  trebleNotes: Array<Vex.Flow.StaveNote>;
  bassNotes: Array<Vex.Flow.StaveNote>;
}
export class SheetMusicSingleNote extends React.Component<ISheetMusicSingleNoteProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent
      size={this.props.size}
      vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.size.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef("treble");
    //topStaff.addTimeSignature("4/4");

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef("bass");
    //bottomStaff.addTimeSignature("4/4");

    const brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);

    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    const voiceTreble = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    const voiceBass = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    
    voiceTreble.addTickables(this.props.trebleNotes).setStave(topStaff);
    voiceBass.addTickables(this.props.bassNotes).setStave(bottomStaff);
    
    const formatter = new Vex.Flow.Formatter();
    
    // Make sure the staves have the same starting point for notes
    const startX = Math.max(topStaff.getNoteStartX(), bottomStaff.getNoteStartX());
    topStaff.setNoteStartX(startX);
    bottomStaff.setNoteStartX(startX);
    
    // the treble and bass are joined independently but formatted together
    formatter.joinVoices([voiceTreble]);
    formatter.joinVoices([voiceBass]);
    formatter.format([voiceTreble, voiceBass], staveLength - (startX - staveX));
    
    voiceTreble.draw(context);
    voiceBass.draw(context);
  }
}

interface IConfigData {
  isTrebleClefEnabled: boolean,
  isBassClefEnabled: boolean,
  areAccidentalsEnabled: boolean
};

export interface ISheetMusicNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface ISheetMusicNotesFlashCardMultiSelectState {}
export class SheetMusicNotesFlashCardMultiSelect extends React.Component<ISheetMusicNotesFlashCardMultiSelectProps, ISheetMusicNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;

    const onIsTrebleClefEnabledChange = this.onIsTrebleClefEnabledChange.bind(this);
    const onIsBassClefEnabledChange = this.onIsBassClefEnabledChange.bind(this);
    const onAreAccidentalsEnabledChange = this.onAreAccidentalsEnabledChange.bind(this);

    return (
      <div>
        <div>
          <span>Treble Clef</span>
          <Checkbox
            checked={configData.isTrebleClefEnabled}
            onChange={onIsTrebleClefEnabledChange}
            disabled={!configData.isBassClefEnabled}
          />
        </div>
        <div>
          <span>Bass Clef</span>
          <Checkbox
            checked={configData.isBassClefEnabled}
            onChange={onIsBassClefEnabledChange}
            disabled={!configData.isTrebleClefEnabled}
          />
        </div>
        <div>
          <span>Accidentals</span>
          <Checkbox
            checked={configData.areAccidentalsEnabled}
            onChange={onAreAccidentalsEnabledChange}
          />
        </div>
      </div>
    );
  }

  private onIsTrebleClefEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }
    
    const configData = this.props.studySessionInfo.configData as IConfigData;

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: checked,
      isBassClefEnabled: configData.isBassClefEnabled,
      areAccidentalsEnabled: configData.areAccidentalsEnabled
    };
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
  private onIsBassClefEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }
    
    const configData = this.props.studySessionInfo.configData as IConfigData;

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: configData.isTrebleClefEnabled,
      isBassClefEnabled: checked,
      areAccidentalsEnabled: configData.areAccidentalsEnabled
    };
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
  private onAreAccidentalsEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }

    const configData = this.props.studySessionInfo.configData as IConfigData;

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: configData.isTrebleClefEnabled,
      isBassClefEnabled: configData.isBassClefEnabled,
      areAccidentalsEnabled: checked
    };
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export const flashCardSet = createFlashCardSet();