import winston from 'winston';
import expressWinston from 'express-winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}}ms - IP: {{req.ip}}',
    expressFormat: false,
    colorize: false,
});

export default requestLogger;