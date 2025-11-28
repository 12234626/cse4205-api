import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { RewardType } from 'src/reward/types/reward.type';

export class CreateRewardDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  @MaxLength(500)
  iconUrl: string;

  @IsEnum(RewardType)
  rewardType: RewardType;
}

export class UpdateRewardDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  iconUrl?: string;

  @IsOptional()
  @IsEnum(RewardType)
  rewardType?: RewardType;
}
