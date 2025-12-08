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
import { QuestStatus } from 'src/user-quest/types/quest-status.type';
import { ConsentRequestEntity } from 'src/consent-request/entities/consent-request.entity';

@Entity('user_quest')
export class UserQuestEntity {
  @PrimaryGeneratedColumn()
  userQuestId: number;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userQuests)
  user: UserEntity;

  @ManyToOne(() => QuestEntity, (quest: QuestEntity) => quest.userQuests)
  quest: QuestEntity;

  @OneToMany(
    () => ConsentRequestEntity,
    (consentRequest) => consentRequest.userQuest,
    { cascade: ['soft-remove'] },
  )
  consentRequests: ConsentRequestEntity[];
}
