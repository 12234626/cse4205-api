import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { VerificationEntity } from 'src/verification/entities/verification.entity';
import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

@Unique(['provider', 'providerId'])
@Unique(['username'])
@Entity('user')
export class UserEntity {
  @ApiProperty({ description: '사용자 ID' })
  @PrimaryGeneratedColumn()
  userId: number;

  @ApiProperty({ enum: Provider, description: 'OAuth 제공자' })
  @Column({ type: 'enum', enum: Provider })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ description: 'OAuth 제공자 ID' })
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  providerId: string;

  @ApiProperty({ enum: UserRole, description: '사용자 역할' })
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: '사용자 이름' })
  @Column({ type: 'varchar', length: 15 })
  @IsString()
  username: string;

  @ApiPropertyOptional({ description: '나이' })
  @Column({ type: 'int', nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @ApiProperty({ description: '레벨', default: 1 })
  @Column({ type: 'int', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ description: '경험치', default: 0 })
  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  exp: number;

  @ApiProperty({ description: '연속 퀘스트 스트릭', default: 0 })
  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  streak: number;

  @ApiPropertyOptional({ description: '아바타 URL' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ApiPropertyOptional({ description: '멘토', type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.mentees)
  mentor?: UserEntity | null;

  @OneToMany(() => UserEntity, (user) => user.mentor, {
    cascade: ['soft-remove'],
  })
  mentees: UserEntity[];

  @OneToMany(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.user,
    { cascade: ['soft-remove'] },
  )
  userQuests: UserQuestEntity[];

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.user,
    { cascade: ['soft-remove'] },
  )
  userRewards: UserRewardEntity[];

  @OneToMany(
    () => VerificationEntity,
    (verification: VerificationEntity) => verification.reviewer,
    { cascade: ['soft-remove'] },
  )
  verifications: VerificationEntity[];
}
