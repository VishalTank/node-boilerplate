const winston = require('winston');

const config = require('./config');

const modifyErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }

    return info;
});

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        modifyErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

module.exports = logger;
