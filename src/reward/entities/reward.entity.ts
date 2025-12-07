import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: '보상 ID' })
  @PrimaryGeneratedColumn()
  rewardId: number;

  @ApiProperty({ description: '보상 제목' })
  @Column({ type: 'varchar', length: 200 })
  @IsString()
  title: string;

  @ApiProperty({ description: '보상 설명' })
  @Column({ type: 'text' })
  @IsString()
  description: string;

  @ApiProperty({ description: '아이콘 이미지 URL' })
  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  iconUrl: string;

  @ApiProperty({ enum: RewardType, description: '보상 유형' })
  @Column({ type: 'enum', enum: RewardType })
  @IsEnum(RewardType)
  rewardType: RewardType;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt: Date | null;

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.reward,
    { cascade: true },
  )
  userRewards: UserRewardEntity[];
}
