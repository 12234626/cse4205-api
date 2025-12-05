import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: '퀘스트 ID' })
  @PrimaryGeneratedColumn()
  questId: number;

  @ApiProperty({ description: '퀘스트 제목' })
  @Column({ type: 'varchar', length: 200 })
  @IsString()
  title: string;

  @ApiProperty({ description: '퀘스트 설명' })
  @Column({ type: 'text' })
  @IsString()
  description: string;

  @ApiProperty({ description: '퀘스트 카테고리' })
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  category: string;

  @ApiProperty({ enum: QuestType, description: '퀘스트 유형' })
  @Column({ type: 'enum', enum: QuestType })
  @IsEnum(QuestType)
  questType: QuestType;

  @ApiProperty({ description: '획든 경험치' })
  @Column({ type: 'int' })
  @IsInt()
  @Min(0)
  expReward: number;

  @ApiProperty({ description: '필요 레벨' })
  @Column({ type: 'int' })
  @IsInt()
  @Min(1)
  levelRequired: number;

  @ApiProperty({ enum: Difficulty, description: '난이도' })
  @Column({ type: 'enum', enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt?: Date;

  @OneToMany(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.quest,
    { cascade: true },
  )
  userQuests: UserQuestEntity[];
}
