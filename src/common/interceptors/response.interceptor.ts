import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  readonly logger = new Logger(ResponseInterceptor.name);

  private formatResponse(
    method: string,
    url: string,
    status: number,
    duration: number,
  ): string {
    return `${method} ${url} ${status} (${duration}ms)`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      map((data: { statusCode?: number }) => {
        if (data?.statusCode) {
          response.status(data.statusCode);
        } else {
          data.statusCode = response.statusCode;
        }

        return data;
      }),
      tap(() => {
        this.logger.log(
          this.formatResponse(
            method,
            url,
            response.statusCode,
            Date.now() - now,
          ),
        );
      }),
      catchError((error: { status?: number }) => {
        this.logger.error(
          this.formatResponse(
            method,
            url,
            error?.status || 500,
            Date.now() - now,
          ),
        );

        return throwError(() => error);
      }),
    );
  }
}
