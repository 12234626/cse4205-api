import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsEnum, IsDate, IsOptional } from 'class-validator';

import type { UserEntity } from 'src/user/entities/user.entity';
import type { QuestEntity } from 'src/quest/entities/quest.entity';
import type { VerificationEntity } from 'src/verification/entities/verification.entity';

export enum QuestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
}

@Entity('user_quest')
export class UserQuestEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  userQuestId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  questId: string;

  @Column({ type: 'date' })
  @IsDate()
  assignedDate: Date;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  completedAt: Date;

  @ManyToOne('UserEntity', (user: UserEntity) => user.userQuests)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne('QuestEntity', (quest: QuestEntity) => quest.userQuests)
  @JoinColumn({ name: 'quest_id' })
  quest: QuestEntity;

  @OneToMany(
    'VerificationEntity',
    (verification: VerificationEntity) => verification.userQuest,
  )
  verifications: VerificationEntity[];
}
