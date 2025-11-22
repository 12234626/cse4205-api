import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

import type { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import type { UserEntity } from 'src/user/entities/user.entity';
import type { UserQuestImageEntity } from 'src/verification/entities/user-quest-image.entity';

export enum ReviewType {
  COMMUNITY = 'community',
  GUARDIAN = 'guardian',
}

@Entity('verification')
export class VerificationEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  verificationId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  userQuestId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  reviewerId: string;

  @Column({ type: 'enum', enum: ReviewType })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @Column({ type: 'boolean' })
  @IsBoolean()
  vote: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsString()
  @IsOptional()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(
    'UserQuestEntity',
    (userQuest: UserQuestEntity) => userQuest.verifications,
  )
  @JoinColumn({ name: 'user_quest_id' })
  userQuest: UserQuestEntity;

  @ManyToOne('UserEntity', (user: UserEntity) => user.verifications)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  @OneToMany(
    'UserQuestImageEntity',
    (image: UserQuestImageEntity) => image.verification,
  )
  images: UserQuestImageEntity[];
}
