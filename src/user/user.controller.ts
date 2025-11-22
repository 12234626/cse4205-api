import {
  Controller,
  Delete,
  UseGuards,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req: Request, @Param('id') id: number) {
    if (!req.user) {
      throw ResponseException.userNotFound();
    }
    if (req.user.userId !== id) {
      throw ResponseException.forbidden();
    }

    await this.userService.softDelete(req.user);
  }
}
