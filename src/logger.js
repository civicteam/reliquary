const { createLogger, format, transports } = require('winston');

const {
  combine, printf,
} = format;

const transportsDefinition = {
  console: new transports.Console({
    colorized: true,
  }),
};

const loggerFormat = printf(info => `${info.message}`);
const logger = createLogger({
  format: combine(
    format.colorize({ all: true }),
    format.splat(),
    format.prettyPrint(),
    loggerFormat,
  ),
  transports: [
    transportsDefinition.console,
  ],
});

module.exports = { logger, transportsDefinition };
