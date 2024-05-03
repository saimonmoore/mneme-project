import { env } from '@/pear-compat.js';
type Level = 'debug' | 'info' | 'log' | 'warn' | 'error';

const levels: Record<Level, number> = {
  debug: 0,
  info: 1,
  log: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private static instance: Logger;
  private level: Level;

  private constructor(level: Level) {
    this.level = level;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(env().NODE_ENV === 'test' ? 'error' : 'debug');
    }
    return Logger.instance;
  }

  public debug(message: string, opts?: unknown): void {
    if (levels.debug >= levels[this.level]) {
      console.log(message, opts);
    }
  }

  public info(message: string, opts?: unknown): void {
    if (levels.info >= levels[this.level]) {
      console.log(message, opts);
    }
  }

  public log(message: string, opts?: unknown): void {
    if (levels.log >= levels[this.level]) {
      console.log(message, opts);
    }
  }

  public warn(message: string, opts?: unknown): void {
    if (levels.warn >= levels[this.level]) {
      console.warn(message, opts);
    }
  }

  public error(message: string, opts?: unknown): void {
    if (levels.error >= levels[this.level]) {
      console.error(message, opts);
    }
  }
}