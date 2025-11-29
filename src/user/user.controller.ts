import { Controller, Delete, UseGuards, Param, Req } from '@nestjs/common';
import type { Request } from 'express';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  async softDelete(@Req() req: Request, @Param('id') id: number) {
    if (req.user!.userId !== id) {
      throw ResponseException.forbidden();
    }

    await this.userService.softDelete(id);

    return ResponseDto.noContent();
  }
}
