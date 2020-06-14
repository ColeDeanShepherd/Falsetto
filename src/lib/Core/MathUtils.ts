import { precondition } from './Dbc';
import { Vector2D } from './Vector2D';
import { Rect2D } from './Rect2D';
import { Size2D } from './Size2D';

export const PI = 3.14159265359;
export const TAU = 6.28318530718;

export function polarToCartesian(r: number, theta: number): Vector2D {
  return new Vector2D(r * Math.cos(theta), r * Math.sin(theta));
}

// TODO: add tests
export function isPowerOf2(x: number): boolean {
  return (x !== 0) && ((x & (x - 1)) === 0);
}

// TODO: add tests
export function highestPowerOf2(n: number): number {
  precondition(Number.isInteger(n));

  let res = 0;
  
  for (let i = n; i >= 1; i--) {
    if (isPowerOf2(i)) {
      res = i;
      break;
    }
  }

  return res; 
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// TODO: add tests
export function range(minValue: number, maxValue: number): Array<number> {
  precondition(Number.isInteger(minValue));
  precondition(Number.isInteger(maxValue));
  precondition(maxValue >= minValue);

  const numValues = 1 + (maxValue - minValue);
  const result = new Array<number>(numValues);

  for (let i = 0; i < numValues; i++) {
    result[i] = minValue + i;
  }

  return result;
}

export function wrapInteger(value: number, minValue: number, maxValue: number): number {
  precondition(maxValue >= minValue);

  const numValuesInRange = (maxValue - minValue) + 1;

  while (value < minValue) {
    value += numValuesInRange;
  }

  while (value > maxValue) {
    value -= numValuesInRange;
  }

  return value;
}

// TODO: add tests
export function wrapReal(value: number, minValue: number, maxValue: number): number {
  precondition(maxValue >= minValue);

  const range = maxValue - minValue;

  while (value < minValue) {
    value += range;
  }

  while (value > maxValue) {
    value -= range;
  }

  return value;
}

// TODO: add tests
export function clamp(value: number, minValue: number, maxValue: number): number {
  precondition(maxValue >= minValue);

  if (value < minValue) {
    return minValue;
  } else if (value > maxValue) {
    return maxValue;
  } else {
    return value;
  }
}

export function growRectAroundCenter(rect: Rect2D, growUnits: number): Rect2D {
  growUnits = Math.max(growUnits, -Math.min(rect.size.width, rect.size.height));
  const halfGrowUnits = growUnits / 2;

  return new Rect2D(
    new Size2D(rect.size.width + growUnits, rect.size.height + growUnits),
    new Vector2D(rect.position.x - halfGrowUnits, rect.position.y - halfGrowUnits)
  );
}

// TODO: add tests
export function shrinkRectToFit(containerSize: Size2D, rectSize: Size2D): Size2D {
  // try to reduce width and see if height fits
  if (rectSize.width > containerSize.width) {
    const scaleFactor = containerSize.width / rectSize.width;
    const scaledWidth = containerSize.width;
    const scaledHeight = scaleFactor * rectSize.height;

    if (scaledHeight <= containerSize.height) {
      return new Size2D(scaledWidth, scaledHeight);
    }
  }

  // try to reduce height and see if width fits
  if (rectSize.height > containerSize.height) {
    const scaleFactor = containerSize.height / rectSize.height;
    const scaledWidth = scaleFactor * rectSize.width;
    const scaledHeight = containerSize.height;

    if (scaledWidth <= containerSize.width) {
      return new Size2D(scaledWidth, scaledHeight);
    }
  }
  
  // If we get here, the rect doesn't need to be resized.
  return rectSize;
}

export function maxScaleFactorToFit(maxWidth: number | undefined, maxHeight: number | undefined, rectSize: Size2D): number {
  let maxScaleFactor = Infinity;

  if ((maxWidth !== undefined) && (rectSize.width !== 0)) {
    maxScaleFactor = maxWidth / rectSize.width;
  }
  
  if ((maxHeight !== undefined) && (rectSize.height !== 0)) {
    maxScaleFactor = Math.min(maxHeight / rectSize.height, maxScaleFactor);
  }

  return maxScaleFactor;
}