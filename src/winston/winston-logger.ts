import {Logger} from 'winston';
import {ILogger} from '../logger.interface';

export class MyWinstonLogger implements ILogger {

  constructor() {

  }

  logger: Logger;

  info(msg: string, key?: string): void {

    this.logger.info(`${msg}`);
  }

}
