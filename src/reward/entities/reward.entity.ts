import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsUrl } from 'class-validator';

import type { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';

export enum RewardType {
  BADGE = 'badge',
  TITLE = 'title',
  ACHIEVEMENT = 'achievement',
  SEASON = 'season',
}

@Entity('reward')
export class RewardEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  rewardId: string;

  @Column({ type: 'varchar', length: 200 })
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @IsString()
  description: string;

  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  iconUrl: string;

  @Column({ type: 'enum', enum: RewardType })
  @IsEnum(RewardType)
  rewardType: RewardType;

  @OneToMany(
    'UserRewardEntity',
    (userReward: UserRewardEntity) => userReward.reward,
  )
  userRewards: UserRewardEntity[];
}
