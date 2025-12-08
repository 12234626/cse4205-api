import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { RewardEntity } from 'src/reward/entities/reward.entity';

@Entity('user_reward')
export class UserRewardEntity {
  @PrimaryGeneratedColumn()
  userRewardId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userRewards)
  user: UserEntity;

  @ManyToOne(() => RewardEntity, (reward: RewardEntity) => reward.userRewards)
  reward: RewardEntity;
}
