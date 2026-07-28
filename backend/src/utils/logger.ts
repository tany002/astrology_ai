type LogLevel = 'info' | 'warn' | 'error';

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

export const logger = {
  info: (context: string, message: string) => {
    console.log(formatMessage('info', context, message));
  },
  warn: (context: string, message: string) => {
    console.warn(formatMessage('warn', context, message));
  },
  error: (context: string, message: string, error?: unknown) => {
    console.error(formatMessage('error', context, message));
    if (error instanceof Error) {
      console.error(`[${context}] Error details:`, error.message);
    }
  },
};
