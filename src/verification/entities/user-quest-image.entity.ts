import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsString, IsUrl } from 'class-validator';

import type { VerificationEntity } from 'src/verification/entities/verification.entity';

@Entity('user_quest_image')
export class UserQuestImageEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  imageId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  verificationId: string;

  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  uploadedAt: Date;

  @ManyToOne(
    'VerificationEntity',
    (verification: VerificationEntity) => verification.images,
  )
  @JoinColumn({ name: 'verification_id' })
  verification: VerificationEntity;
}
