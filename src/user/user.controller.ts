import {
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { CheckUsernameResponseDto } from './dtos/check-username.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('사용자')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('check-username')
  @ApiOperation({ summary: '사용자 이름 중복 확인' })
  @ApiResponse({
    status: 200,
    description: '중복 확인 완료',
    type: CheckUsernameResponseDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async checkUsername(@Query('username') username: string) {
    const exists = await this.userService.checkUsernameExists(username);

    return ResponseDto.ok<CheckUsernameResponseDto>({ exists });
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 204, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async softRemove(@Req() req: Request, @Param('id') id: number) {
    if (!req.user) {
      throw ResponseException.userNotFound();
    }
    if (req.user.userId !== id) {
      throw ResponseException.forbidden();
    }

    await this.userService.softRemove(id);

    return ResponseDto.noContent();
  }
}
