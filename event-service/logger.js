import  *  as  winston  from  'winston';
import  'winston-daily-rotate-file';

// Configure logger. Will create new log file for each day
const transport = new winston.transports.DailyRotateFile({
    filename: 'event-service/output-logs/errors_%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
  });

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    defaultMeta: { service: 'Event-service' },
    transports: [transport]
});

export default logger;
