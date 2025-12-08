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
  @PrimaryGeneratedColumn()
  consentReviewId: number;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  comment: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity)
  reviewer: UserEntity;

  @ManyToOne(
    () => ConsentRequestEntity,
    (consentRequest) => consentRequest.reviews,
  )
  consentRequest: ConsentRequestEntity;
}
