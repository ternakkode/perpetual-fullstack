import { Logger } from 'typeorm';
import { Logger as PinoLogger } from 'nestjs-pino';

export class TypeOrmPinoLogger implements Logger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  logQuery(query: string, parameters?: any[]) {
    this.pinoLogger.log({
      message: 'Executing SQL query',
      query,
      parameters,
    }, 'TypeORM Query');
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.pinoLogger.error({
      message: 'SQL query execution failed',
      error: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      query,
      parameters,
    }, 'TypeORM Query Error');
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.pinoLogger.warn({
      message: `Slow SQL query detected (${time}ms)`,
      time,
      query,
      parameters,
    }, 'TypeORM Slow Query');
  }

  logSchemaBuild(message: string) {
    this.pinoLogger.log({ message }, 'TypeORM Schema Build');
  }

  logMigration(message: string) {
    this.pinoLogger.log({ message }, 'TypeORM Migration');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'warn') {
      this.pinoLogger.warn({ message }, 'TypeORM');
    } else {
      this.pinoLogger.log({ message }, 'TypeORM');
    }
  }
}