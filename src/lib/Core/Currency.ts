import { zeroPad } from "./StringUtils";

export function usCentsToDollarsString(usCents: number): string {
  const dollars = Math.floor(usCents / 100);
  const remainderCents = usCents % 100;
  return `$${dollars}.${zeroPad(remainderCents.toString(), /*desiredLength*/ 2)}`
}