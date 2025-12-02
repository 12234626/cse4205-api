import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsOptional, IsUrl } from 'class-validator';

import { VerificationEntity } from 'src/verification/entities/verification.entity';

@Entity('verification_image')
export class VerificationImageEntity {
  @ApiProperty({ description: '검증 이미지 ID' })
  @PrimaryGeneratedColumn()
  verificationImageId: number;

  @ApiProperty({ description: '이미지 URL' })
  @Column({ type: 'varchar', length: 500 })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({ description: '검증', type: () => VerificationEntity })
  @ManyToOne(
    () => VerificationEntity,
    (verification: VerificationEntity) => verification.verificationImages,
  )
  verification: VerificationEntity;
}
