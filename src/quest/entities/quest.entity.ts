import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsInt, Min } from 'class-validator';

import type { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';

export enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  EVENT = 'event',
  NORMAL = 'normal',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('quest')
export class QuestEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  questId: string;

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

  @OneToMany('UserQuestEntity', (userQuest: UserQuestEntity) => userQuest.quest)
  userQuests: UserQuestEntity[];
}
