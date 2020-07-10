export interface ILogger {
  logInfo(message?: any, ...optionalParams: any[]): void;
  logWarning(message?: any, ...optionalParams: any[]): void;
  logError(message?: any, ...optionalParams: any[]): void;
}

export class ConsoleLogger implements ILogger {
  public logInfo(message?: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  }
  public logWarning(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }
  public logError(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}