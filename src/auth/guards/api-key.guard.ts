import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { createHash } from 'crypto';

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
      console.log('[DEBUG API KEY] No valid API key in backend env!', {
        validApiKey, // undefined일 경우 확인용
        apiKey,
        ip: request.ip,
        xff: request.headers['x-forwarded-for'],
      });
      throw ResponseException.unauthorized();
    }

    if (!apiKey || apiKey !== validApiKey) {
      const hash = (str: string) =>
        createHash('sha256').update(str).digest('hex').slice(0, 12);

      console.log('[DEBUG API KEY] Incoming request failed API key check', {
        apiKeyExists: !!apiKey,
        apiKeyLen: apiKey?.length,
        apiKeyFp: apiKey ? hash(apiKey) : null,
        validApiKeyLen: validApiKey.length,
        validApiKeyFp: hash(validApiKey),
        ip: request.ip,
        xff: request.headers['x-forwarded-for'],
      });
      throw ResponseException.unauthorized();
    }

    return true;
  }
}
