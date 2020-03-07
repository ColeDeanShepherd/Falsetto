import StackTrace from "stacktrace-js";

export async function getErrorDescription(
  msg: string | Event,
  file: string | undefined, line: number | undefined, col: number | undefined,
  error: Error | undefined
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fallbackErrorDescription = `${file}: ${msg} (${line}:${col})`;

    if (error !== undefined) {
      StackTrace.fromError(error)
        .then(stackFrames => {
          const stringifiedStack = stackFrames
            .map(sf => sf.toString())
            .join('\n');
          const errorDescription = (
            error.name
              ? (error.name) + ": " + stringifiedStack
              : stringifiedStack
          );
          resolve(errorDescription);
        })
        .catch(err => {
          resolve(fallbackErrorDescription + "\n\n" + err);
        });
    } else {
      resolve(fallbackErrorDescription);
    }
  });
}