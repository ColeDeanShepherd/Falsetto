export interface IDisposable {
  dispose(): void;
}

export function using(disposable: IDisposable, fn: (disposable: IDisposable) => void) {
  try {
    fn(disposable);
  } finally {
    disposable.dispose();
  }
}