import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, IsEnum, IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { ConsentRequestImageEntity } from './consent-request-image.entity';
import { ConsentReviewEntity } from 'src/consent-review/entities/consent-review.entity';
import { ConsentRequestType } from 'src/consent-request/types/consent-request-type.type';

@Entity('consent_request')
@Unique(['userQuest', 'requestType'])
export class ConsentRequestEntity {
  @PrimaryGeneratedColumn()
  consentRequestId: number;

  @Column({ type: 'enum', enum: ConsentRequestType })
  @IsEnum(ConsentRequestType)
  requestType: ConsentRequestType;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @ManyToOne(() => UserQuestEntity, (userQuest) => userQuest.consentRequests)
  userQuest: UserQuestEntity;

  @OneToMany(
    () => ConsentRequestImageEntity,
    (consentRequestImage) => consentRequestImage.consentRequest,
    { cascade: true },
  )
  images: ConsentRequestImageEntity[];

  @OneToMany(
    () => ConsentReviewEntity,
    (consentReview) => consentReview.consentRequest,
    { cascade: true },
  )
  reviews: ConsentReviewEntity[];
}
