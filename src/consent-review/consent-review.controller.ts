import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { ConsentReviewService } from './consent-review.service';
import { ConsentRequestService } from 'src/consent-request/consent-request.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConsentReviewDto } from './dtos/consent-review.dto';
import { CreateConsentReviewDto } from './dtos/create-consent-review.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ConsentRequestType } from 'src/consent-request/types/consent-request-type.type';
import { UserRoles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/types/user-role.type';

@ApiTags('승인 리뷰')
@Controller('consent-review')
export class ConsentReviewController {
  constructor(
    private readonly consentReviewService: ConsentReviewService,
    private readonly consentRequestService: ConsentRequestService,
  ) {}

  @Post(':userQuestId/:requestType')
  @UseGuards(JwtAccessAuthGuard)
  @UserRoles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '승인 리뷰 작성' })
  @ApiParam({
    name: 'requestType',
    enum: ConsentRequestType,
    description: '요청 타입',
  })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
    type: ConsentReviewDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({ status: 403, description: '권한 없음 (INVALID_REVIEW_TYPE)' })
  @ApiResponse({
    status: 404,
    description: '승인 요청을 찾을 수 없음 (CONSENT_REQUEST_NOT_FOUND)',
  })
  async create(
    @Req() req: Request,
    @Param('requestType') requestType: ConsentRequestType,
    @Param('userQuestId') userQuestId: number,
    @Body() body: CreateConsentReviewDto,
  ) {
    const consentReview = await this.consentReviewService.create(
      req.user,
      requestType,
      userQuestId,
      body.comment,
    );

    return ResponseDto.created<ConsentReviewDto>(
      new ConsentReviewDto(consentReview),
    );
  }
}
