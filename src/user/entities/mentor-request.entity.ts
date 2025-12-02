import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { RequestStatus } from 'src/user/types/request-status.type';

@Entity('mentor_request')
export class MentorRequestEntity {
  @PrimaryGeneratedColumn()
  mentorRequestId: number;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  mentee: UserEntity;

  @ManyToOne(() => UserEntity)
  mentor: UserEntity;
}
