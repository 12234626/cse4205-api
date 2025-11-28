import {
  IsInt,
  IsEnum,
  IsBoolean,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { ReviewType } from 'src/verification/types/review.type';

export class CreateVerificationDto {
  @IsInt()
  userQuestId: number;

  @IsInt()
  reviewerId: number;

  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @IsBoolean()
  vote: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class UpdateVerificationDto {
  @IsOptional()
  @IsEnum(ReviewType)
  reviewType?: ReviewType;

  @IsOptional()
  @IsBoolean()
  vote?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
