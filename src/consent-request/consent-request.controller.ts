import {
  Controller,
  UseGuards,
  Get,
  Post,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { ConsentRequestService } from './consent-request.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { PostDto } from './dtos/post.dto';
import { ConsentRequestType } from './types/consent-request-type.type';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { CreateCommunityRequestDto as CreateRequestDto } from './dtos/create-community-request.dto';

@ApiTags('승인 요청')
@Controller('consent-request')
export class ConsentRequestController {
  constructor(private readonly consentRequestService: ConsentRequestService) {}

  @Get('mentor')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토 퀘스트 승인 요청 목록' })
  @ApiResponse({
    status: 200,
    description: '요청 목록 조회 성공',
    type: [PostDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  async findAllMentorRequests(@Req() req: Request) {
    const consentRequests = await this.consentRequestService.findAll({
      where: {
        requestType: ConsentRequestType.MENTOR,
        author: { mentor: { userId: req.user.userId } },
      },
      relations: [
        'author',
        'images',
        'reviews',
        'reviews.reviewer',
        'author.mentor',
        'userQuest',
      ],
    });

    return ResponseDto.ok<PostDto[]>(
      consentRequests.map((req) => new PostDto(req)),
    );
  }

  @Get('community')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 퀘스트 승인 요청 목록' })
  @ApiResponse({
    status: 200,
    description: '요청 목록 조회 성공',
    type: [PostDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll() {
    const consentRequests = await this.consentRequestService.findAll({
      where: { requestType: ConsentRequestType.COMMUNITY },
      relations: [
        'author',
        'images',
        'reviews',
        'reviews.reviewer',
        'userQuest',
      ],
    });

    return ResponseDto.ok<PostDto[]>(
      consentRequests.map((req) => new PostDto(req)),
    );
  }

  @Get(':requestType/:userQuestId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '승인 요청 상세 조회' })
  @ApiParam({
    name: 'requestType',
    enum: ConsentRequestType,
    description: '요청 타입',
  })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 200,
    description: '요청 조회 성공',
    type: PostDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '승인 요청을 찾을 수 없음 (CONSENT_REQUEST_NOT_FOUND)',
  })
  async findOne(
    @Param('requestType') requestType: ConsentRequestType,
    @Param('userQuestId') userQuestId: number,
  ) {
    const consentRequest = await this.consentRequestService.findOne({
      where: { requestType, userQuest: { userQuestId } },
      relations: [
        'author',
        'images',
        'reviews',
        'reviews.reviewer',
        'userQuest',
      ],
    });

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    return ResponseDto.ok<PostDto>(new PostDto(consentRequest));
  }

  @Post('mentor/:userQuestId')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: '멘토 승인 요청 생성' })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 201,
    description: '승인 요청 생성 성공',
    type: PostDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 승인 요청이 존재함 (CONSENT_REQUEST_ALREADY_EXISTS)',
  })
  async createMentorRequest(
    @Req() req: Request,
    @Param('userQuestId') userQuestId: number,
  ) {
    const consentRequest = await this.consentRequestService.create(
      req.user,
      ConsentRequestType.MENTOR,
      userQuestId,
    );

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    return ResponseDto.created<PostDto>(new PostDto(consentRequest));
  }

  @Post('community/:userQuestId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '커뮤니티 승인 요청 생성',
  })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 201,
    description: '승인 요청 생성 성공',
    type: PostDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 승인 요청이 존재함 (CONSENT_REQUEST_ALREADY_EXISTS)',
  })
  async createCommunityRequest(
    @Req() req: Request,
    @Param('userQuestId') userQuestId: number,
    @Body() body: CreateRequestDto,
  ) {
    const consentRequest = await this.consentRequestService.create(
      req.user,
      ConsentRequestType.COMMUNITY,
      userQuestId,
      body.title,
      body.content,
    );

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    return ResponseDto.created<PostDto>(new PostDto(consentRequest));
  }

  @Post(':requestType/:userQuestId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '승인 요청 생성' })
  @ApiParam({
    name: 'requestType',
    description: '요청 유형',
    enum: ConsentRequestType,
  })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 201,
    description: '승인 요청 생성 성공',
    type: PostDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (FORBIDDEN)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 승인 요청이 존재함 (CONSENT_REQUEST_ALREADY_EXISTS)',
  })
  async createConsentRequest(
    @Req() req: Request,
    @Param('requestType') requestType: ConsentRequestType,
    @Param('userQuestId') userQuestId: number,
    @Body() body: CreateRequestDto,
  ) {
    const consentRequest = await this.consentRequestService.create(
      req.user,
      requestType,
      userQuestId,
      body.title,
      body.content,
    );

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    return ResponseDto.created<PostDto>(new PostDto(consentRequest));
  }
}
