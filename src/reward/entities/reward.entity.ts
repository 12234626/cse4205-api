import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsEnum, IsUrl, IsOptional } from 'class-validator';

import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { RewardType } from 'src/reward/types/reward.type';

@Entity('reward')
export class RewardEntity {
  @PrimaryGeneratedColumn()
  rewardId: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.reward,
  )
  userRewards: UserRewardEntity[];
}
