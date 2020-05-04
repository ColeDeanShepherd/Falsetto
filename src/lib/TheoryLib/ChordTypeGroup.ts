import { ChordType } from "./ChordType";

export class ChordTypeGroup {
  public constructor(
    public name: string,
    public chordTypes: Array<ChordType>
  ) {}
}