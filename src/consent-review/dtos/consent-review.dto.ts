import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import { ConsentReviewEntity } from 'src/consent-review/entities/consent-review.entity';
import { UserDto } from 'src/user/dtos/user.dto';

export class ConsentReviewDto {
  @ApiProperty({ description: '퀘스트 승인 리뷰 ID' })
  consentReviewId: number;

  @ApiPropertyOptional({ description: '댓글' })
  @IsString()
  @IsOptional()
  comment: string | null;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  deletedAt: Date | null;

  @ApiProperty({ description: '리뷰어', type: () => UserDto })
  reviewer: UserDto;

  constructor(consentReview: ConsentReviewEntity) {
    this.consentReviewId = consentReview.consentReviewId;
    this.comment = consentReview.comment;
    this.createdAt = consentReview.createdAt;
    this.deletedAt = consentReview.deletedAt;
    this.reviewer = new UserDto(consentReview.reviewer);
  }
}
