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
  @PrimaryGeneratedColumn()
  verificationId: number;

  @Column({ type: 'enum', enum: ReviewType })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @Column({ type: 'boolean' })
  @IsBoolean()
  vote: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ManyToOne(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.verifications,
  )
  userQuest: UserQuestEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.verifications)
  reviewer: UserEntity;

  @OneToMany(
    () => VerificationImageEntity,
    (image: VerificationImageEntity) => image.verification,
    { cascade: ['soft-remove'] },
  )
  verificationImages: VerificationImageEntity[];
}
