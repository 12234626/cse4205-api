import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: '사용자 보상 ID' })
  @PrimaryGeneratedColumn()
  userRewardId: number;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt: Date | null;

  @ApiProperty({ description: '사용자', type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userRewards)
  user: UserEntity;

  @ApiProperty({ description: '보상', type: () => RewardEntity })
  @ManyToOne(() => RewardEntity, (reward: RewardEntity) => reward.userRewards)
  reward: RewardEntity;
}
