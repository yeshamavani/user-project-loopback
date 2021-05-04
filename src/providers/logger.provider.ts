import {Provider, ValueOrPromise} from '@loopback/core';
import {ILogger} from '../logger.interface';
import {MyWinstonConsoleLogger} from '../winston/console-logger';


export class LoggerProvider implements Provider<ILogger> {
  constructor() {
    this.logger = new MyWinstonConsoleLogger();
  }

  logger: ILogger;

  value(): ValueOrPromise<ILogger> {

    return this.logger;
  }


}
