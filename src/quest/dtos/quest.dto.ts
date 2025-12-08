import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsDate, Min } from 'class-validator';

import { QuestEntity } from 'src/quest/entities/quest.entity';
import { QuestType, Difficulty } from 'src/quest/types/quest.type';

export class QuestDto {
  @ApiProperty({ description: '퀘스트 ID' })
  @IsInt()
  @Min(1)
  questId: number;

  @ApiProperty({ description: '퀘스트 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '퀘스트 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '퀘스트 카테고리' })
  @IsString()
  category: string;

  @ApiProperty({ enum: QuestType, description: '퀘스트 유형' })
  @IsEnum(QuestType)
  questType: QuestType;

  @ApiProperty({ description: '획득 경험치' })
  @IsInt()
  @Min(0)
  expReward: number;

  @ApiProperty({ description: '필요 레벨' })
  @IsInt()
  @Min(1)
  levelRequired: number;

  @ApiProperty({ enum: Difficulty, description: '난이도' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  constructor(quest: QuestEntity) {
    this.questId = quest.questId;
    this.title = quest.title;
    this.description = quest.description;
    this.category = quest.category;
    this.questType = quest.questType;
    this.expReward = quest.expReward;
    this.levelRequired = quest.levelRequired;
    this.difficulty = quest.difficulty;
    this.createdAt = quest.createdAt;
  }
}
