import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewType } from 'src/verification/types/review.type';
import { UserRole } from 'src/user/types/user-role.type';

export class VerificationResponseDto {
  @ApiProperty({ description: '검증 ID' })
  verificationId: number;

  @ApiProperty({ enum: ReviewType, description: '검증 유형' })
  reviewType: ReviewType;

  @ApiProperty({ description: '승인 여부' })
  vote: boolean;

  @ApiPropertyOptional({ description: '검증 코멘트' })
  comment?: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '작성자 정보', nullable: true })
  reviewer: {
    userId: number;
    username: string;
    role: UserRole;
    avatarUrl?: string | null;
    level: number;
    exp: number;
  } | null;

  @ApiPropertyOptional({ description: '사용자 퀘스트 ID' })
  userQuestId?: number;
}
