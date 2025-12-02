import {
  IsInt,
  IsEnum,
  IsBoolean,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ReviewType } from 'src/verification/types/review.type';

export class CreateVerificationDto {
  @ApiProperty({ description: '사용자 퀘스트 ID' })
  @IsInt()
  userQuestId: number;

  @ApiProperty({ description: '검증자 ID' })
  @IsInt()
  reviewerId: number;

  @ApiProperty({ enum: ReviewType, description: '검증 유형' })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @ApiProperty({ description: '승인 여부' })
  @IsBoolean()
  vote: boolean;

  @ApiPropertyOptional({ description: '검증 코멘트' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateVerificationDto {
  @ApiPropertyOptional({ enum: ReviewType, description: '검증 유형' })
  @IsOptional()
  @IsEnum(ReviewType)
  reviewType?: ReviewType;

  @ApiPropertyOptional({ description: '승인 여부' })
  @IsOptional()
  @IsBoolean()
  vote?: boolean;

  @ApiPropertyOptional({ description: '검증 코멘트' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
