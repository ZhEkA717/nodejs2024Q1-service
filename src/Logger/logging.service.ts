import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { saveLogs } from 'src/Logs/saveLogs';
import { TypeLogs, env } from 'src/utils/constants';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private size = +this.config.get(env.MAX_SIZE_FILE);

  writeError(message: string) {
    const fileName: TypeLogs = 'error.log.txt';
    this.setContext('Error');
    this.error(message);
    saveLogs(message, fileName, this.size);
  }

  logRequest(req: Request): void {
    const fileName: TypeLogs = 'request.log.txt';
    this.setContext('Request');
    const [, url, params] = req.baseUrl.split('/');
    const [query] = req.url.split('?');
    const logs = `URL: /${url || ''} - PARAMETERS: ${params || ''} - QUERY: ${
      query || ''
    } - METHOD: ${req.method}`;
    this.log(logs);
    saveLogs(logs, fileName, this.size);
  }

  logResponse(res: Response): void {
    const fileName: TypeLogs = 'responce.log.txt';
    this.setContext('Response');
    const { statusCode, statusMessage } = res;
    const logs = `STATUS CODE: ${statusCode} - STATUS MESSAGE: ${statusMessage}`;
    this.log(logs);
    saveLogs(logs, fileName, this.size);
  }
}
