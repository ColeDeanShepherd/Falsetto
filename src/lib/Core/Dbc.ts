// TODO: don't run asserts in prod?
// TODO: add tests
export function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Failed assertion.");
  }
}

// TODO: add tests
export function precondition(condition: boolean) {
  assert(condition);
}

// TODO: add tests
export function invariant(condition: boolean) {
  assert(condition);
}