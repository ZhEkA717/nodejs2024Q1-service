import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from 'src/Logger/logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.loggingService.logRequest(req);

    res.on('finish', () => {
      this.loggingService.logResponse(res);
    });
    if (next) next();
  }
}
