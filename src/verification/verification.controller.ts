import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { VerificationService } from './verification.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { VerificationEntity } from './entities/verification.entity';
import {
  CreateVerificationDto,
  UpdateVerificationDto,
} from './dtos/verification.dto';
import { VerificationResponseDto } from './dtos/verification-response.dto';
import { TodayReviewCountDto } from './dtos/today-count.dto';
import { ReviewType } from './types/review.type';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('검증')
@ApiBearerAuth()
@Controller('verification')
@UseGuards(JwtAccessAuthGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  @ApiOperation({ summary: '전체 검증 조회 또는 타입별 검증 조회' })
  @ApiQuery({
    name: 'reviewType',
    required: false,
    enum: ReviewType,
    description:
      '검증 타입 (guideline: 가이드라인, mentor: 멘토 검증, community: 커뮤니티 검증)',
  })
  @ApiResponse({
    status: 200,
    description: '검증 조회 성공',
    type: [VerificationResponseDto],
  })
  async findAll(@Query('reviewType') reviewType?: ReviewType) {
    let verifications: VerificationEntity[];

    if (reviewType) {
      verifications =
        await this.verificationService.findByReviewType(reviewType);
    } else {
      verifications = await this.verificationService.findAll();
    }

    const response = verifications.map((v) => this.mapToResponseDto(v));

    return ResponseDto.ok<VerificationResponseDto[]>(response);
  }

  @Get('today/count')
  @ApiOperation({ summary: '오늘 현재 사용자가 리뷰한 인증글 개수 조회' })
  @ApiResponse({
    status: 200,
    description: '오늘 리뷰한 인증글 개수 조회 성공',
    type: TodayReviewCountDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async getTodayReviewCount(@Req() req: Request) {
    const count = await this.verificationService.countTodayReviewsByUser(
      req.user.userId,
    );

    return ResponseDto.ok<TodayReviewCountDto>({ count });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 사용자가 작성한 검증 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 검증 내역 조회 성공',
    type: [VerificationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (NOT_FOUND)',
  })
  async findByUser(@Param('userId') userId: number) {
    const verifications = await this.verificationService.findByReviewer(userId);

    const response = verifications.map((v) => this.mapToResponseDto(v));

    return ResponseDto.ok<VerificationResponseDto[]>(response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 검증 조회' })
  @ApiResponse({
    status: 200,
    description: '검증 조회 성공',
    type: VerificationEntity,
  })
  @ApiResponse({
    status: 404,
    description: '검증을 찾을 수 없음 (VERIFICATION_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const verification = await this.verificationService.findOne(id);

    if (!verification) {
      throw ResponseException.verificationNotFound();
    }

    return ResponseDto.ok<VerificationEntity>(verification);
  }

  @Post()
  @ApiOperation({ summary: '새 검증 생성' })
  @ApiResponse({
    status: 201,
    description: '검증 생성 성공',
    type: VerificationEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createVerificationDto: CreateVerificationDto) {
    const verification = await this.verificationService.create(
      createVerificationDto,
    );

    return ResponseDto.created<VerificationEntity>(verification);
  }

  @Put(':id')
  @ApiOperation({ summary: '검증 수정' })
  @ApiResponse({
    status: 200,
    description: '검증 수정 성공',
    type: VerificationEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({
    status: 404,
    description: '검증을 찾을 수 없음 (VERIFICATION_NOT_FOUND)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    const verification = await this.verificationService.update(
      id,
      updateVerificationDto,
    );
    return ResponseDto.ok<VerificationEntity>(verification);
  }

  private mapToResponseDto(v: VerificationEntity): VerificationResponseDto {
    return {
      verificationId: v.verificationId,
      reviewType: v.reviewType,
      vote: v.vote,
      comment: v.comment,
      createdAt: v.createdAt,
      reviewer: v.reviewer
        ? {
            userId: v.reviewer.userId,
            username: v.reviewer.username,
            role: v.reviewer.role,
            avatarUrl: v.reviewer.avatarUrl,
            level: v.reviewer.level,
            exp: v.reviewer.exp,
          }
        : null,
      userQuestId: v.userQuest?.userQuestId,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '검증 삭제' })
  @ApiResponse({ status: 204, description: '검증 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '검증을 찾을 수 없음 (VERIFICATION_NOT_FOUND)',
  })
  async softRemove(@Param('id') id: number) {
    await this.verificationService.softRemove(id);

    return ResponseDto.noContent();
  }
}
