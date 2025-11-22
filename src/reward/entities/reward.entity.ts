import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsInt, IsEnum, IsUrl } from 'class-validator';

import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { RewardType } from 'src/reward/types/reward.type';

@Entity('reward')
export class RewardEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
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

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.reward,
  )
  userRewards: UserRewardEntity[];
}
