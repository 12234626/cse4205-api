import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsDate, IsOptional, Min } from 'class-validator';

import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { UserDto } from 'src/user/dtos/user.dto';
import { RewardDto } from 'src/reward/dtos/reward.dto';

export class UserRewardDto {
  @ApiProperty({ description: '사용자 보상 ID' })
  @IsInt()
  @Min(1)
  userRewardId: number;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({ description: '사용자', type: () => UserDto })
  @IsOptional()
  user?: UserDto;

  @ApiPropertyOptional({ description: '보상', type: () => RewardDto })
  @IsOptional()
  reward?: RewardDto;

  constructor(userReward: UserRewardEntity, includeRelations = false) {
    this.userRewardId = userReward.userRewardId;
    this.createdAt = userReward.createdAt;

    if (includeRelations) {
      if (userReward.user) {
        this.user = new UserDto(userReward.user);
      }
      if (userReward.reward) {
        this.reward = new RewardDto(userReward.reward);
      }
    }
  }
}
