import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { IsInt, IsString, IsUrl } from 'class-validator';

import type { VerificationEntity } from 'src/verification/entities/verification.entity';

@Entity('verification_image')
export class VerificationImageEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
  imageId: number;

  @Column({ type: 'int' })
  @IsString()
  verificationId: string;

  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(
    'VerificationEntity',
    (verification: VerificationEntity) => verification.verificationImages,
  )
  verification: VerificationEntity;
}
