
export function areSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) { return false; }
  
  for (const e of a) {
    if (!b.has(e)) { return false; }
  }

  return true;
}

export function isSuperset<T>(a: Set<T>, b: Set<T>): boolean {
  for (const e of b) {
    if (!a.has(e)) {
      return false;
    }
  }

  return true;
}

export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const difference = new Set<T>(a);

  for (const e of b) {
    difference.delete(e);
  }

  return difference;
}

export function mapSet<T, R>(set: Set<T>, selector: (t: T) => R): Array<R> {
  const result = new Array<R>(set.size);

  for (const e of set) {
    result.push(selector(e));
  }

  return result;
}

export function mapFilter<T>(set: Set<T>, predicate: (t: T) => boolean): Array<T> {
  const result = new Array<T>();

  for (const e of set) {
    if (predicate(e)) {
      result.push(e);
    }
  }

  return result;
}

// TODO: add tests
export function immutableToggleSetElement<T>(set: Set<T>, element: T): Set<T> {
  const newSet = new Set<T>(set);

  if (!newSet.delete(element)) {
    newSet.add(element);
  }

  return newSet;
}

export function setWithout<T>(set: Set<T>, elementToExclude: T): Set<T> {
  const result = new Set<T>(set);
  result.delete(elementToExclude);
  return result;
}

export function setWithoutMany<T>(set: Set<T>, ...elementsToExclude: Array<T>): Set<T> {
  const result = new Set<T>(set);

  for (const elementToExclude of elementsToExclude) {
    result.delete(elementToExclude);
  }
  
  return result;
}

export function setWith<T>(set: Set<T>, elementToInclude: T): Set<T> {
  const result = new Set<T>(set);
  result.add(elementToInclude);
  return result;
}