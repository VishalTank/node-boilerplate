const mongoose = require('mongoose');

const config = require('./config/config');
const logger = require('./config/logger');
const app = require('./app');

let server;

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (err) => {
    logger.error(err);

    exitHandler();
};

mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        logger.info('Database connection successful');

        server = app.listen(config.port, () => {
            logger.info(`Server started on port: ${config.port}`);
        });
    })
    .catch((err) => {
        logger.error(err);
    });

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    logger.info('SIGTERM received');

    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    }
});
