import winston from 'winston';

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

export const appFileLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'src/utils/logs/app-file.log', format: fileFormat }),
  ],
});

export const healthFileLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'src/utils/logs/health-file.log', format: fileFormat }),
  ],
});