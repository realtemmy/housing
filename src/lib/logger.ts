export interface LogContext {
  requestId?: string;
  userId?: string;
  role?: string;
  path?: string;
  method?: string;
  [key: string]: any;
}

export class Logger {
  private format(level: string, message: string, context?: LogContext): string {
    const logObj = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
    return JSON.stringify(logObj);
  }

  info(message: string, context?: LogContext): void {
    console.log(this.format("INFO", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.format("WARN", message, context));
  }

  error(message: string, error?: any, context?: LogContext): void {
    const errObj = error instanceof Error
      ? { errorMessage: error.message, stack: error.stack }
      : { errorDetail: error };
    console.error(this.format("ERROR", message, { ...context, ...errObj }));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.format("DEBUG", message, context));
    }
  }
}

export const logger = new Logger();
