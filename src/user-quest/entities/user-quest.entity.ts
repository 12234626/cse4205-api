import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { QuestEntity } from 'src/quest/entities/quest.entity';
import { QuestStatus } from 'src/user-quest/types/quest-status.type';

@Entity('user_quest')
export class UserQuestEntity {
  @ApiProperty({ description: '사용자 퀘스트 ID' })
  @PrimaryGeneratedColumn()
  userQuestId: number;

  @ApiProperty({
    enum: QuestStatus,
    description: '퀘스트 진행 상태',
    default: QuestStatus.PENDING,
  })
  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @ApiPropertyOptional({ description: '퀘스트 완료 시간' })
  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt?: Date;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({ description: '사용자', type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userQuests)
  user: UserEntity;

  @ApiProperty({ description: '퀘스트', type: () => QuestEntity })
  @ManyToOne(() => QuestEntity, (quest: QuestEntity) => quest.userQuests)
  quest: QuestEntity;
}
