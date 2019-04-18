import * as Vex from "vexflow";

import { Rational } from "./Rational";

export function noteDurationToVexFlowStr(noteDuration: Rational): string {
  if (noteDuration.equals(new Rational(1, 1))) {
    return "w";
  } else if (noteDuration.equals(new Rational(1, 2))) {
    return "h";
  } else if (noteDuration.equals(new Rational(1, 4))) {
    return "q";
  } else if (noteDuration.equals(new Rational(1, 8))) {
    return "8";
  } else {
    throw new Error(`Duration not implemented: ${noteDuration.toString()}`)
  }
}
export function getTimeSignatureStr(numBeats: number, beatNoteValue: number): string {
  return `${numBeats}/${beatNoteValue}`;
}