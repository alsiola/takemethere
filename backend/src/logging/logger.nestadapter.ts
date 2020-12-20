import * as winston from 'winston';

export class NestLoggerAdapter {
  constructor(private logger: winston.Logger) {}

  public log = this.logger.info.bind(this.logger);
  public error = this.logger.error.bind(this.logger);
  public warn = this.logger.warn.bind(this.logger);
  public debug = this.logger.debug.bind(this.logger);
  public verbose = this.logger.verbose.bind(this.logger);
}
