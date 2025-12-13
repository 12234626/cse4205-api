import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import type { Request } from 'express';

import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string | undefined;

    const validApiKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (!validApiKey) {
      throw ResponseException.unauthorized();
    }

    if (!apiKey || apiKey !== validApiKey) {
      throw ResponseException.unauthorized();
    }

    return true;
  }
}
