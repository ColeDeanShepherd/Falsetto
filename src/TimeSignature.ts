import * as Utils from "./Utils";

export class TimeSignature {
  public static parse(str: string): TimeSignature {
    const splitStr = str.split('/');
    return new TimeSignature(parseInt(splitStr[0]), parseInt(splitStr[1]));
  }

  public constructor(public numBeats: number, public beatNoteValue: number) {
    Utils.precondition(numBeats > 0);
    Utils.precondition(beatNoteValue > 0);
  }
  public toString(): string {
    return `${this.numBeats}/${this.beatNoteValue}`;
  }
}