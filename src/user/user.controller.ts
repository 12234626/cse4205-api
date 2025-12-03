import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UserService } from './services/user.service';
import { MentorRequestService } from './services/mentor-request.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoles } from 'src/auth/decorators/role.decorator';
import { CheckUsernameResponseDto } from './dtos/check-username.dto';
import { PublicProfileDto } from './dtos/public-profile.dto';
import { CreateMentorRequestDto } from './dtos/mentor-request.dto';
import { UserEntity } from './entities/user.entity';
import { MentorRequestEntity } from './entities/mentor-request.entity';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserRole } from './types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('사용자')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mentorRequestService: MentorRequestService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  getProfile(@Req() req: Request) {
    return ResponseDto.ok<UserEntity>(req.user);
  }

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

  @Get('profile/username/:username')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '닉네임으로 사용자 프로필 조회' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: PublicProfileDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async getProfileByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const publicProfile: PublicProfileDto = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatarUrl,
      level: user.level,
      exp: user.exp,
    };

    return ResponseDto.ok<PublicProfileDto>(publicProfile);
  }

  @Get('mentor-requests/sent')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내가 보낸 멘토 요청 조회' })
  @ApiResponse({
    status: 200,
    description: '보낸 요청 조회 성공',
    type: [MentorRequestEntity],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async getMySentRequests(@Req() req: Request) {
    const requests = await this.mentorRequestService.findByMentee(req.user);

    return ResponseDto.ok<MentorRequestEntity[]>(requests);
  }

  @Get('mentor-requests/received')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내가 받은 멘토 요청 조회' })
  @ApiResponse({
    status: 200,
    description: '받은 요청 조회 성공',
    type: [MentorRequestEntity],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async getMyReceivedRequests(@Req() req: Request) {
    const requests = await this.mentorRequestService.findByMentor(req.user);

    return ResponseDto.ok<MentorRequestEntity[]>(requests);
  }

  @Post('mentor-requests')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토 요청 보내기' })
  @ApiResponse({
    status: 201,
    description: '멘토 요청 생성 성공',
    type: MentorRequestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '멘토를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 요청이 존재함 (MENTOR_REQUEST_ALREADY_EXIST)',
  })
  async createMentorRequest(
    @Req() req: Request,
    @Body() createMentorRequestDto: CreateMentorRequestDto,
  ) {
    const request = await this.mentorRequestService.create(
      req.user,
      createMentorRequestDto,
    );

    return ResponseDto.created<MentorRequestEntity>(request);
  }

  @Put('mentor-requests/:id/accept')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토 요청 수락' })
  @ApiResponse({
    status: 200,
    description: '요청 수락 성공',
    type: MentorRequestEntity,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 상태 (INVALID_MENTOR_REQUEST)',
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '요청을 찾을 수 없음 (MENTOR_REQUEST_NOT_FOUND)',
  })
  async acceptMentorRequest(@Req() req: Request, @Param('id') id: number) {
    const request = await this.mentorRequestService.accept(req.user, id);

    return ResponseDto.ok<MentorRequestEntity>(request);
  }

  @Put('mentor-requests/:id/reject')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토 요청 거절' })
  @ApiResponse({
    status: 200,
    description: '요청 거절 성공',
    type: MentorRequestEntity,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 상태 (INVALID_MENTOR_REQUEST)',
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '요청을 찾을 수 없음 (MENTOR_REQUEST_NOT_FOUND)',
  })
  async rejectMentorRequest(@Req() req: Request, @Param('id') id: number) {
    const request = await this.mentorRequestService.reject(req.user, id);

    return ResponseDto.ok<MentorRequestEntity>(request);
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
