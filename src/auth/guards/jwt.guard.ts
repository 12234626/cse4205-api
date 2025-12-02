import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenService } from 'src/auth/services/token.service';
import { UserService } from 'src/user/services/user.service';
import { USER_ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { Payload } from 'src/auth/types/token.type';
import { TokenType } from 'src/auth/types/token.type';
import { UserRole } from 'src/user/types/user-role.type';

async function canActivate(
  context: ExecutionContext,
  reflector: Reflector,
  jwtService: JwtService,
  tokenService: TokenService,
  userService: UserService,
  secret: string,
  tokenType: TokenType,
): Promise<boolean> {
  const request = context.switchToHttp().getRequest<Request>();
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ResponseException.unauthorized();
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwtService.verify<Payload>(token, { secret });
    const isVerified = await tokenService.verifyToken(token, tokenType);

    if (!isVerified) {
      throw ResponseException.unauthorized();
    }

    request.token = token;
    request.payload = payload;
  } catch {
    throw ResponseException.unauthorized();
  }

  const user = await userService.findOne(request.payload.sub);

  if (!user) {
    throw ResponseException.userNotFound();
  }

  request.user = user;

  const roles = reflector.getAllAndOverride<UserRole[]>(USER_ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (!roles) {
    return true;
  }

  if (!roles.includes(user.role)) {
    throw ResponseException.invalidRole();
  }

  return true;
}

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.getOrThrow<string>('jwt.secret.access');

    return await canActivate(
      context,
      this.reflector,
      this.jwtService,
      this.tokenService,
      this.userService,
      secret,
      'access',
    );
  }
}

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.getOrThrow<string>('jwt.secret.refresh');

    return await canActivate(
      context,
      this.reflector,
      this.jwtService,
      this.tokenService,
      this.userService,
      secret,
      'refresh',
    );
  }
}
