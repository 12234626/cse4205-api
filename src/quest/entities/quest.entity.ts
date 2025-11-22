import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsInt, Min } from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { QuestType, Difficulty } from 'src/quest/types/quest.type';

@Entity('quest')
export class QuestEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
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

  @OneToMany(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.quest,
  )
  userQuests: UserQuestEntity[];
}
