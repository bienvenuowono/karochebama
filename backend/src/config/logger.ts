import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env } from './env';

const { combine, timestamp, json, colorize, simple } = winston.format;

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? combine(colorize(), simple()) : json(),
  }),
];

if (env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(timestamp(), json()),
    })
  );
}

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(timestamp(), json()),
  transports,
});

export default logger;
