import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '멘토 요청 ID' })
  @PrimaryGeneratedColumn()
  mentorRequestId: number;

  @ApiProperty({
    enum: RequestStatus,
    description: '요청 상태',
    default: RequestStatus.PENDING,
  })
  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: '멘티', type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  mentee: UserEntity;

  @ApiProperty({ description: '멘토', type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  mentor: UserEntity;
}
