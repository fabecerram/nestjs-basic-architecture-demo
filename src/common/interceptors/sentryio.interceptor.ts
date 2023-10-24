import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((exception) => {
        Sentry.captureException(exception);
      }),
    );
  }
}
