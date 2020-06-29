const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const { MONGODB_URL } = process.env;
const { combine, timestamp, json, simple, colorize, printf } = format;
const colorizer = colorize();

/* eslint-disable arrow-body-style */
const consoleLogger = createLogger({
  transports: [
    new transports.Console({
      format: combine(
        timestamp(),
        simple(),
        printf((msg) => {
          return colorizer.colorize(
            msg.level,
            `[${msg.timestamp}]: ${msg.message}`,
          );
        }),
      ),
    }),
  ],
});

const dbLogger = createLogger({
  transports: [
    new transports.MongoDB({
      format: combine(timestamp(), json()),
      db: MONGODB_URL,
      collection: 'logger',
      options: { useUnifiedTopology: true },
    }),
  ],
});

module.exports = { dbLogger, consoleLogger };
