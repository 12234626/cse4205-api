import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsOptional, IsString, IsUrl } from 'class-validator';

import { VerificationEntity } from 'src/verification/entities/verification.entity';

@Entity('verification_image')
export class VerificationImageEntity {
  @PrimaryGeneratedColumn()
  verificationImageId: number;

  @Column({ type: 'int' })
  @IsString()
  verificationId: string;

  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ManyToOne(
    () => VerificationEntity,
    (verification: VerificationEntity) => verification.verificationImages,
  )
  verification: VerificationEntity;
}
