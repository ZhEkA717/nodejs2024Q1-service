import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  writeError(message: string) {
    this.error(message);
  }

  logRequest(req: Request): void {
    this.setContext('Request');
    const [, url, params] = req.baseUrl.split('/');
    const [query] = req.url.split('?');
    const logs = `URL: /${url} - PARAMETERS: ${params} - QUERY: ${query} - METHOD: ${req.method}`;
    this.log(logs);
  }

  logResponse(res: Response): void {
    this.setContext('Response');
    const { statusCode, statusMessage } = res;
    const logs = `STATUS CODE: ${statusCode} - STATUS MESSAGE: ${statusMessage}`;
    this.log(logs);
  }
}
