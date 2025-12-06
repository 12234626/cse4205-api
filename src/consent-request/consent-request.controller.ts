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

  @Get('/:requestType')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '승인 요청 목록' })
  @ApiParam({
    name: 'requestType',
    enum: ConsentRequestType,
    description: '요청 타입',
  })
  @ApiResponse({
    status: 200,
    description: '요청 목록 조회 성공',
    type: [PostDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll(
    @Req() req: Request,
    @Param('requestType') requestType: ConsentRequestType,
  ) {
    const requests = await this.consentRequestService.findAll(requestType);

    return ResponseDto.ok<PostDto[]>(requests.map((req) => new PostDto(req)));
  }

  @Get('/:requestType/:userQuestId')
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
    const request = await this.consentRequestService.findOne(
      requestType,
      userQuestId,
    );

    if (!request) {
      throw ResponseException.consentRequestNotFound();
    }

    return ResponseDto.ok<PostDto>(new PostDto(request));
  }

  @Post('/:requestType/:userQuestId')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTEE)
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
  @ApiResponse({
    status: 404,
    description: '사용자 퀴스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
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
    const request = await this.consentRequestService.create(
      req.user,
      requestType,
      userQuestId,
      body.title,
      body.content,
    );

    return ResponseDto.created<PostDto>(new PostDto(request));
  }
}
