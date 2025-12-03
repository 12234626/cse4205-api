import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsEnum,
  IsBoolean,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

import { ReviewType } from 'src/verification/types/review.type';
import { UserRole } from 'src/user/types/user-role.type';

export class VerificationResponseDto {
  @ApiProperty({ description: '검증 ID' })
  @IsInt()
  @Min(1)
  verificationId: number;

  @ApiProperty({ enum: ReviewType, description: '검증 유형' })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @ApiProperty({ description: '승인 여부' })
  @IsBoolean()
  vote: boolean;

  @ApiPropertyOptional({ description: '검증 코멘트' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '작성자 정보' })
  reviewer: {
    userId: number;
    username: string;
    role: UserRole;
    avatarUrl?: string | null;
    level: number;
    exp: number;
  };

  @ApiPropertyOptional({ description: '사용자 퀘스트 ID' })
  @IsInt()
  @IsOptional()
  userQuestId?: number;
}
