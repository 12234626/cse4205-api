import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsString, IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { ConsentRequestEntity } from 'src/consent-request/entities/consent-request.entity';

@Entity('consent_review')
export class ConsentReviewEntity {
  @ApiProperty({ description: '퀘스트 승인 리뷰 ID' })
  @PrimaryGeneratedColumn()
  consentReviewId: number;

  @ApiPropertyOptional({ description: '댓글' })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  comment: string | null;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ description: '리뷰어', type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  reviewer: UserEntity;

  @ApiProperty({
    description: '승인 요청',
    type: () => ConsentRequestEntity,
  })
  @ManyToOne(
    () => ConsentRequestEntity,
    (consentRequest) => consentRequest.reviews,
  )
  consentRequest: ConsentRequestEntity;
}
