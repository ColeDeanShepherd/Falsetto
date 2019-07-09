import { ChordQuality, chordQualityToString } from './ChordQuality';

export class ChordName {
  public constructor(
    public quality: ChordQuality,
    public extension: number | null,
    public alterations: Array<string>
  ) {}

  public toString(): string {
    const qualityString = chordQualityToString(this.quality);
    const extensionString = (this.extension !== null)
      ? ` ${this.extension.toString()}th`
      : "";
    const alterationsString = (this.alterations.length > 0)
      ? " " + this.alterations.join()
      : "";
    return `${qualityString}${extensionString}${alterationsString}`;
  }
}