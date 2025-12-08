import { IsString, IsEnum, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RewardType } from 'src/reward/types/reward.type';

export class CreateRewardDto {
  @ApiProperty({ description: '보상 제목' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '보상 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '아이콘 이미지 URL' })
  @IsUrl()
  @MaxLength(500)
  iconUrl: string;

  @ApiProperty({ enum: RewardType, description: '보상 유형' })
  @IsEnum(RewardType)
  rewardType: RewardType;
}
