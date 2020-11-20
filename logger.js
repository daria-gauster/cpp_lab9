const winston = require('winston');
const Sentry = require('winston-raven-sentry');

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'HH:mm:ss'
                }),
                winston.format.printf(info => `${info.level}: ${info.message}`)
            )
        }),
        new Sentry({ //Вывод в Sentry
            level: 'warn', //Уровень warn или выше
            dsn: "https://f9166453a7cf4895ac82bc65720e8d97@sentry.io/1315972",
            debug: true
        })
    ],
});

logger.stream = {
    write: (message, encoding)=>{
        logger.info(message.replace(/[\n]/g, ""));
    }
};

module.exports = logger;