import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configs/config.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class BrowserSessionInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hasBrowserSession = request.signedCookies['browser_sid'];
        console.log('hasBrowserSession', hasBrowserSession);

        if (hasBrowserSession) {
          return;
        }

        const response = context.switchToHttp().getResponse<Response>();
        const appConfig = this.configService.get<AppConfig>('app');
        // Determine if we're in production
        const isProduction = appConfig?.isProduction || false;

        response.cookie('browser_sid', randomUUID(), {
          httpOnly: true,
          path: '/',
          signed: true,
          sameSite: isProduction ? 'strict' : 'lax',
        });
      }),
    );
  }
}
