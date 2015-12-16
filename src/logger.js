import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { NODE_ENV } from './config';

const LOG_FILES_DIR_PATH = path.resolve(__dirname, '..', 'logs');

const mkdirSyncIfNotExist = (dirPath) => {
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};

mkdirSyncIfNotExist(LOG_FILES_DIR_PATH);

const fileTransport = new winston.transports.File({
  level: 'info',
  filename: path.resolve(LOG_FILES_DIR_PATH, 'server-logs.log'),
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: false
});

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  json: false,
  colorize: true
});

winston.emitErrs = true;
let logger;
if (NODE_ENV === 'development') {
  logger = new winston.Logger({
    transports: [
      fileTransport,
      consoleTransport
    ],
    exitOnError: false
  });
} else {
  logger = new winston.Logger({
    transports: [
      fileTransport
    ],
    exitOnError: false
  });
}

logger.stream = {
  write: (message) => {
    // can also pass encoding as an argument
    logger.info(message);
  }
};

export default logger;
