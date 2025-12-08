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

import { ResponseException } from 'src/common/exceptions/response.exception';

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
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      map((data: { statusCode?: number }) => {
        if (data?.statusCode) {
          response.status(data.statusCode);
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
        const status = error?.status || 500;

        this.logger.error(
          this.formatResponse(method, url, status, Date.now() - now),
        );

        return throwError(() => {
          if (error instanceof ResponseException) {
            return error;
          }
          return ResponseException.internalServerError();
        });
      }),
    );
  }
}
