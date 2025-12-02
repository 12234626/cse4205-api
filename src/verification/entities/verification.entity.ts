import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { VerificationImageEntity } from 'src/verification/entities/verification-image.entity';
import { ReviewType } from 'src/verification/types/review.type';

@Entity('verification')
export class VerificationEntity {
  @ApiProperty({ description: '검증 ID' })
  @PrimaryGeneratedColumn()
  verificationId: number;

  @ApiProperty({ enum: ReviewType, description: '검증 유형' })
  @Column({ type: 'enum', enum: ReviewType })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @ApiProperty({ description: '승인 여부' })
  @Column({ type: 'boolean' })
  @IsBoolean()
  vote: boolean;

  @ApiPropertyOptional({ description: '검증 코멘트' })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({ description: '사용자 퀘스트', type: () => UserQuestEntity })
  @ManyToOne(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.verifications,
  )
  userQuest: UserQuestEntity;

  @ApiProperty({ description: '검증자', type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.verifications)
  reviewer: UserEntity;

  @OneToMany(
    () => VerificationImageEntity,
    (image: VerificationImageEntity) => image.verification,
    { cascade: ['soft-remove'] },
  )
  verificationImages: VerificationImageEntity[];
}
