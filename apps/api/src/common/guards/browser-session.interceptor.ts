import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { AppConfig } from 'src/common/config/app.config';

@Injectable()
export class BrowserSessionInterceptor implements NestInterceptor {
  constructor(private readonly appConfig: AppConfig) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hasBrowserSession = request.signedCookies['browser_sid'];

        if (hasBrowserSession) {
          return;
        }

        const response = context.switchToHttp().getResponse<Response>();

        response.cookie('browser_sid', randomUUID(), {
          httpOnly: true,
          path: '/',
          signed: true,
          sameSite: this.appConfig.isProduction ? 'strict' : 'lax',
        });
      }),
    );
  }
}
