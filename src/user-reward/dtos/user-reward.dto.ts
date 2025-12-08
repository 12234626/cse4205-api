import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsDate } from 'class-validator';

import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { UserDto } from 'src/user/dtos/user.dto';
import { RewardDto } from 'src/reward/dtos/reward.dto';

export class UserRewardDto {
  @ApiProperty({ description: '사용자 보상 ID' })
  @IsInt()
  userRewardId: number;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({ description: '사용자', type: () => UserDto })
  user: UserDto;

  @ApiPropertyOptional({ description: '보상', type: () => RewardDto })
  reward: RewardDto;

  constructor(userReward: UserRewardEntity) {
    this.userRewardId = userReward.userRewardId;
    this.createdAt = userReward.createdAt;
    this.user = new UserDto(userReward.user);
    this.reward = new RewardDto(userReward.reward);
  }
}
