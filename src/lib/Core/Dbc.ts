// Design by contract utilities.

export function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Failed assertion.");
  }
}
export const precondition = (condition: boolean) => assert(condition);
export const postcondition = (condition: boolean) => assert(condition);
export const invariant = (condition: boolean) => assert(condition);