import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsUrl, IsDate, Min } from 'class-validator';

import { RewardEntity } from 'src/reward/entities/reward.entity';
import { RewardType } from 'src/reward/types/reward.type';

export class RewardDto {
  @ApiProperty({ description: '보상 ID' })
  @IsInt()
  @Min(1)
  rewardId: number;

  @ApiProperty({ description: '보상 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '보상 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '아이콘 이미지 URL' })
  @IsUrl()
  iconUrl: string;

  @ApiProperty({ enum: RewardType, description: '보상 유형' })
  @IsEnum(RewardType)
  rewardType: RewardType;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  constructor(reward: RewardEntity) {
    this.rewardId = reward.rewardId;
    this.title = reward.title;
    this.description = reward.description;
    this.iconUrl = reward.iconUrl;
    this.rewardType = reward.rewardType;
    this.createdAt = reward.createdAt;
  }
}
