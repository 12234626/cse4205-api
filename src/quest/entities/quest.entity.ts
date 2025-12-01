import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsEnum, IsInt, Min, IsOptional } from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { QuestType, Difficulty } from 'src/quest/types/quest.type';

@Entity('quest')
export class QuestEntity {
  @PrimaryGeneratedColumn()
  questId: number;

  @Column({ type: 'varchar', length: 200 })
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @IsString()
  description: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  category: string;

  @Column({ type: 'enum', enum: QuestType })
  @IsEnum(QuestType)
  questType: QuestType;

  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  expReward: number;

  @Column({ type: 'int' })
  @IsInt()
  @Min(1)
  levelRequired: number;

  @Column({ type: 'enum', enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @OneToMany(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.quest,
  )
  userQuests: UserQuestEntity[];
}
