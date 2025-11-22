import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsInt } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { RewardEntity } from 'src/reward/entities/reward.entity';

@Entity('user_reward')
export class UserRewardEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
  userRewardId: number;

  @Column({ type: 'int' })
  @IsInt()
  userId: number;

  @Column({ type: 'int' })
  @IsInt()
  rewardId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userRewards)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RewardEntity, (reward: RewardEntity) => reward.userRewards)
  @JoinColumn({ name: 'reward_id' })
  reward: RewardEntity;
}
