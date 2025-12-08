import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { RewardType } from 'src/reward/types/reward.type';

export class UpdateRewardDto {
  @ApiPropertyOptional({ description: '보상 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '보상 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '아이콘 이미지 URL' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  iconUrl?: string;

  @ApiPropertyOptional({ enum: RewardType, description: '보상 유형' })
  @IsOptional()
  @IsEnum(RewardType)
  rewardType?: RewardType;
}
