import { createLogger, format, transports } from "winston";

const { combine, colorize, timestamp, align, printf } = format;

const formatter = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}] ${message}`;
});

export class Logger {
  static logger = createLogger({
    level: "info",
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
      }),
      align(),
      formatter
    ),
    transports: [new transports.Console()],
  });

  static info(message: string | unknown): void {
    Logger.logger.info(message);
  }

  static error(message: string | unknown): void {
    Logger.logger.error(message);
  }

  static debug(message: string | unknown): void {
    Logger.logger.debug(message);
  }

  static warning(message: string | unknown): void {
    Logger.logger.warn(message);
  }
}
