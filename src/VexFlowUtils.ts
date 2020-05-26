import { precondition } from './lib/Core/Dbc';
import { Rational } from "./lib/Core/Rational";

export function noteDurationToVexFlowStr(noteDuration: Rational): string {
  precondition(noteDuration.numerator === 1);
  precondition(noteDuration.denominator >= 1);

  if (noteDuration.denominator < 2) {
    return "w";
  } else if (noteDuration.denominator < 4) {
    return "h";
  } else if (noteDuration.denominator < 8) {
    return "q";
  } else if (noteDuration.denominator < 16) {
    return "8";
  } else if (noteDuration.denominator < 32) {
    return "16";
  } else if (noteDuration.denominator < 64) {
    return "32";
  } else if (noteDuration.denominator < 128) {
    return "64";
  } else if (noteDuration.denominator < 256) {
    return "128";
  } else {
    throw new Error(`Duration not implemented: ${noteDuration.toString()}`)
  }
}