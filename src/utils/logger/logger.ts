import { v4 as uuidv4 } from 'uuid';
const namespace = require('continuation-local-storage').getNamespace('logger');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appRoot = require('app-root-path');
const logsPath = `${appRoot}/lib/logger/logs/`;

const fileFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf((info: any) => {
    let log = '';
    try {
      const logId = namespace && namespace.get('logId') ? namespace.get('logId') : uuidv4();
      const { timestamp, level, message, ...args } = info;
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      log = `${ts} - ${logId} - ${level}: ${message ? message.trim() : ''} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
      return log;
    } catch (error) {
      console.log('Error @ fileFormat @ logger ', error);
    }
  }),
);

const info = createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      level: 'info',
      filename: `${logsPath}/info-%DATE%.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      colorize: false,
    }),
  ],
});

const error = createLogger({
  level: 'error',
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      level: 'error',
      filename: `${logsPath}/error-%DATE%.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      colorize: false,
    }),
  ],
});

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf((info: any) => {
    let log = '';
    try {
      const logId = namespace && namespace.get('logId') ? namespace.get('logId') : uuidv4();
      const { timestamp, level, message, ...args } = info;
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      log = `${ts} - ${logId} - ${level}: ${message ? message.trim() : ''} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
      return log;
    } catch (error) {
      console.log('Error @ fileFormat @ logger ', error);
    }
  }),
);

if (process.env.NODE_ENV !== 'production') {
  info.add(
    new transports.Console({
      format: consoleFormat,
    }),
  );
  error.add(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}

const logger = {
  info: async (msg: any, ...args: any) => {
    info.info(msg, ...args);
  },
  error: async (msg: any, ...args: any) => {
    error.error(msg, ...args);
  },
};
export default logger;
