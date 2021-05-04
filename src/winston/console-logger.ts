import {createLogger, transports} from 'winston';
import {MyWinstonLogger} from './winston-logger';

export class MyWinstonConsoleLogger extends MyWinstonLogger {

  constructor() {
    super();

    this.logger = createLogger({
      transports: [new transports.Console()],
      level: 'info'
    });
  }
}
