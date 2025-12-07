import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsString } from 'class-validator';

import { ConsentRequestEntity } from './consent-request.entity';

@Entity('consent_request_image')
export class ConsentRequestImageEntity {
  @PrimaryGeneratedColumn()
  consentRequestImageId: number;

  @Column({ type: 'varchar', length: 500 })
  @IsString()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => ConsentRequestEntity,
    (consentRequest) => consentRequest.images,
  )
  consentRequest: ConsentRequestEntity;
}
