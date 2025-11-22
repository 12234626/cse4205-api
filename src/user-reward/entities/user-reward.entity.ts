import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';

import type { UserEntity } from 'src/user/entities/user.entity';
import type { RewardEntity } from 'src/reward/entities/reward.entity';

@Entity('user_reward')
export class UserRewardEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  userRewardId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  rewardId: string;

  @CreateDateColumn({ type: 'timestamp' })
  awardedAt: Date;

  @ManyToOne('UserEntity', (user: UserEntity) => user.userRewards)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne('RewardEntity', (reward: RewardEntity) => reward.userRewards)
  @JoinColumn({ name: 'reward_id' })
  reward: RewardEntity;
}
