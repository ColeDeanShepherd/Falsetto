import * as React from "react";
import { Howl } from "howler";

import { randomElement } from "../../lib/Core/Random";
import { commonKeyPitchesOctave0 } from "../../lib/TheoryLib/Key";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Scale, ScaleType } from "../../lib/TheoryLib/Scale";

import * as Audio from "../../Audio/Audio";
import { Card } from "../Card/Card";
import { metronomeClickAudioPath } from "./Metronome";

function getRandomScaleRootPitch(): Pitch {
  return randomElement(commonKeyPitchesOctave0);
}

const scaleTypesToChooseFrom = ScaleType.MajorScaleModes
  .concat([
    ScaleType.MajorPentatonic,
    ScaleType.MinorPentatonic,
    ScaleType.MelodicMinor,
    ScaleType.AlteredDominant,
    ScaleType.HarmonicMinor,

  ])
  .concat(ScaleType.DiminishedScales)
  .concat(ScaleType.BluesScales)
  .concat(ScaleType.WholeTone);

function getRandomScaleType(): ScaleType {
  return randomElement(scaleTypesToChooseFrom);
}

function getRandomScale(): Scale {
  return new Scale(getRandomScaleType(), getRandomScaleRootPitch());
}

const scaleGenerationIntervalSeconds = 30;

export interface IRandomScaleGeneratorProps {}
export interface IRandomScaleGeneratorState {
  currentScale: Scale
}

export class RandomScaleGenerator extends React.Component<IRandomScaleGeneratorProps, IRandomScaleGeneratorState> {
  public constructor(props: IRandomScaleGeneratorProps) {
    super(props);

    this.state = {
      currentScale: getRandomScale()
    };
  }

  public componentDidMount() {
    Audio.loadSoundAsync(metronomeClickAudioPath)
      .then(clickSound => {
        this.clickSound = clickSound;
      })
      .catch(error => {
        window.alert(`Failed loading sounds: ${error}`);
      });

    this.changeScaleIntervalId = window.setInterval(() => {
      if (this.clickSound) {
        this.clickSound.play();
      }

      this.setState({ currentScale: getRandomScale() });
    }, 1000 * scaleGenerationIntervalSeconds);
  }

  public componentWillUnmount() {
    if (this.changeScaleIntervalId !== undefined) {
      window.clearInterval(this.changeScaleIntervalId);
    }
  }

  public render(): JSX.Element {
    const { currentScale } = this.state;

    return (
      <Card>
        <h2 className="margin-bottom">
          Random Scale Generator
        </h2>
        <p>This page will generate a random scale every {scaleGenerationIntervalSeconds} seconds.</p>
        <p>{currentScale.id}</p>
      </Card>
    );
  }
  
  private changeScaleIntervalId: number | undefined;
  private clickSound: Howl | null = null;
}