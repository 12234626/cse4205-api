import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/types/user-role.type';
import { USER_ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {
    super({
      property: 'payload',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValidated = await super.canActivate(context);

    if (!isValidated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const payload = request.payload;

    const user = await this.userService.findByProviderId(
      payload.provider,
      payload.providerId,
    );

    if (!user) {
      throw ResponseException.userNotFound();
    }

    if (user.deletedAt) {
      throw ResponseException.userDeleted();
    }

    request.user = user;

    const roles = this.reflector.getAllAndOverride<UserRole[]>(USER_ROLES_KEY, [
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
}
