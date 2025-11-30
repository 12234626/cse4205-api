import { Controller, Delete, UseGuards, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('사용자')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAccessAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 204, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async softDelete(@Req() req: Request, @Param('id') id: number) {
    if (!req.user) {
      throw ResponseException.userNotFound();
    }
    if (req.user.userId !== id) {
      throw ResponseException.forbidden();
    }

    await this.userService.softDelete(id);

    return ResponseDto.noContent();
  }
}
