export interface Result<T, E> {
  isOk: boolean;
  value?: T;
  error?: E;
}

export function Ok<T, E>(value: T): Result<T, E> {
  return {
    isOk: true,
    value: value
  };
}

export function Err<T, E>(error: E): Result<T, E> {
  return {
    isOk: false,
    error: error
  };
}