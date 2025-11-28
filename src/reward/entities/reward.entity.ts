import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { IsString, IsEnum, IsUrl } from 'class-validator';

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

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.reward,
  )
  userRewards: UserRewardEntity[];
}
