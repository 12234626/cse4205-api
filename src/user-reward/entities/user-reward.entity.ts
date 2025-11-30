import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsInt } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { RewardEntity } from 'src/reward/entities/reward.entity';

@Entity('user_reward')
export class UserRewardEntity {
  @PrimaryGeneratedColumn()
  userRewardId: number;

  @Column({ type: 'int' })
  @IsInt()
  userId: number;

  @Column({ type: 'int' })
  @IsInt()
  rewardId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userRewards)
  user: UserEntity;

  @ManyToOne(() => RewardEntity, (reward: RewardEntity) => reward.userRewards)
  reward: RewardEntity;
}
