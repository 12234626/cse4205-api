import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UserService } from './services/user.service';
import { MentorRequestService } from './services/mentor-request.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoles } from 'src/auth/decorators/role.decorator';
import { UserEntity } from './entities/user.entity';
import { MentorRequestEntity } from './entities/mentor-request.entity';
import { UserDto } from './dtos/user.dto';
import { CreateMentorRequestDto } from './dtos/mentor-request.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserRole } from './types/user-role.type';
import { RequestStatus } from './types/request-status.type';
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

  @Get('profile/username/:username')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '이름으로 사용자 프로필 조회' })
  @ApiParam({ name: 'username', description: '사용자 닉네임' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: UserDto,
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

    return ResponseDto.ok<UserDto>(new UserDto(user));
  }

  @Get('mentor')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 멘토 조회' })
  @ApiResponse({
    status: 200,
    description: '멘토 조회 성공',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  @ApiResponse({
    status: 404,
    description: '멘토를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async getMyMentor(@Req() req: Request) {
    const mentor = await this.userService.findMentor(req.user);

    if (!mentor) {
      throw ResponseException.userNotFound();
    }

    return ResponseDto.ok<UserDto>(new UserDto(mentor));
  }

  @Get('mentee')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 멘티 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '멘티 목록 조회 성공',
    type: [UserDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  async getMyMentees(@Req() req: Request) {
    const mentees = await this.userService.findMentees(req.user);

    return ResponseDto.ok<UserDto[]>(
      mentees.map((mentee) => new UserDto(mentee)),
    );
  }

  @Get('mentor-request/mentee')
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
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  async getMySentRequests(@Req() req: Request) {
    const requests = await this.mentorRequestService.findByMentee(req.user);

    return ResponseDto.ok<MentorRequestEntity[]>(requests);
  }

  @Get('mentor-request/mentor')
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
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  async getMyReceivedRequests(@Req() req: Request) {
    const requests = await this.mentorRequestService.findByMentor(req.user);

    return ResponseDto.ok<MentorRequestEntity[]>(requests);
  }

  @Post('mentor-request')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토-멘티 관계 요청 보내기' })
  @ApiResponse({
    status: 201,
    description: '관계 요청 생성 성공',
    type: MentorRequestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 요청이 존재함 (MENTOR_REQUEST_ALREADY_EXIST)',
  })
  async createMentorRequest(
    @Req() req: Request,
    @Body() createMentorRequestDto: CreateMentorRequestDto,
  ) {
    const mentorRequest = await this.mentorRequestService.create(
      req.user,
      createMentorRequestDto.otherUsername,
    );

    return ResponseDto.created<MentorRequestEntity>(mentorRequest);
  }

  @Put('mentor-request/accept/:mentorRequestId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토-멘티 관계 요청 수락' })
  @ApiParam({ name: 'mentorRequestId', description: '멘토 요청 ID' })
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
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  @ApiResponse({
    status: 404,
    description: '요청을 찾을 수 없음 (MENTOR_REQUEST_NOT_FOUND)',
  })
  async acceptMentorRequest(
    @Req() req: Request,
    @Param('mentorRequestId') mentorRequestId: number,
  ) {
    const mentorRequest = await this.mentorRequestService.updateStatus(
      req.user,
      mentorRequestId,
      RequestStatus.ACCEPTED,
    );

    return ResponseDto.ok<MentorRequestEntity>(mentorRequest);
  }

  @Put('mentor-request/reject/:mentorRequestId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토-멘티 관계 요청 거절' })
  @ApiParam({ name: 'mentorRequestId', description: '멘토 요청 ID' })
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
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  @ApiResponse({
    status: 404,
    description: '요청을 찾을 수 없음 (MENTOR_REQUEST_NOT_FOUND)',
  })
  async rejectMentorRequest(
    @Req() req: Request,
    @Param('mentorRequestId') mentorRequestId: number,
  ) {
    const mentorRequest = await this.mentorRequestService.updateStatus(
      req.user,
      mentorRequestId,
      RequestStatus.REJECTED,
    );

    return ResponseDto.ok<MentorRequestEntity>(mentorRequest);
  }

  @Delete()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 204, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async softRemove(@Req() req: Request) {
    await this.userService.softRemove(req.user);

    return ResponseDto.noContent();
  }

  @Delete('mentor')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTEE)
  @ApiOperation({ summary: '내 멘토 제거' })
  @ApiResponse({ status: 204, description: '멘토 제거 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  @ApiResponse({
    status: 404,
    description: '멘토를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async removeMyMentor(@Req() req: Request) {
    await this.userService.removeMentor(req.user);

    return ResponseDto.noContent();
  }

  @Delete('mentee')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 멘티 전체 제거' })
  @ApiResponse({ status: 204, description: '멘티 전체 제거 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  async removeMyMentees(@Req() req: Request) {
    await this.userService.removeMentees(req.user);

    return ResponseDto.noContent();
  }

  @Delete('mentee/:menteeId')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 멘티 제거' })
  @ApiParam({ name: 'menteeId', description: '멘티 ID' })
  @ApiResponse({ status: 204, description: '멘티 제거 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (FORBIDDEN)',
  })
  @ApiResponse({
    status: 404,
    description: '멘티를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async removeMentee(@Req() req: Request, @Param('menteeId') menteeId: number) {
    await this.userService.removeMentee(req.user, menteeId);

    return ResponseDto.noContent();
  }
}
