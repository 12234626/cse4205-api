import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { QuestEntity } from 'src/quest/entities/quest.entity';
import { VerificationEntity } from 'src/verification/entities/verification.entity';
import { QuestStatus } from 'src/user-quest/types/quest-status.type';

@Entity('user_quest')
export class UserQuestEntity {
  @PrimaryGeneratedColumn()
  @IsString()
  userQuestId: string;

  @Column({ type: 'int' })
  @IsInt()
  userId: number;

  @Column({ type: 'int' })
  @IsInt()
  questId: number;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt: Date;

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
