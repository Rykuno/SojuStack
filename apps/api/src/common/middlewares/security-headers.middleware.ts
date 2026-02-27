import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { hoursToSeconds } from 'date-fns';
import { AppConfig } from '../config/app.config';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  constructor(private readonly appConfig: AppConfig) {}

  use(_request: Request, response: Response, next: NextFunction): void {
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Resource-Policy', 'same-site');

    if (this.appConfig.isProduction) {
      response.setHeader(
        'Strict-Transport-Security',
        `max-age=${hoursToSeconds(24 * 180)}; includeSubDomains`,
      );
    }

    next();
  }
}
