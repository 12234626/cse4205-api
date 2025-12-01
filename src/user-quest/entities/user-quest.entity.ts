import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { QuestEntity } from 'src/quest/entities/quest.entity';
import { VerificationEntity } from 'src/verification/entities/verification.entity';
import { QuestStatus } from 'src/user-quest/types/quest-status.type';

@Entity('user_quest')
export class UserQuestEntity {
  @PrimaryGeneratedColumn()
  userQuestId: number;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userQuests)
  user: UserEntity;

  @ManyToOne(() => QuestEntity, (quest: QuestEntity) => quest.userQuests)
  quest: QuestEntity;

  @OneToMany(
    () => VerificationEntity,
    (verification: VerificationEntity) => verification.userQuest,
  )
  verifications: VerificationEntity[];
}
