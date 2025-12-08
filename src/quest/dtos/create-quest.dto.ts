import { IsString, IsEnum, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { QuestType, Difficulty } from 'src/quest/types/quest.type';

export class CreateQuestDto {
  @ApiProperty({ description: '퀘스트 제목' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '퀘스트 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '퀘스트 카테고리' })
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiProperty({ enum: QuestType, description: '퀘스트 유형' })
  @IsEnum(QuestType)
  questType: QuestType;

  @ApiProperty({ description: '획득 경험치', minimum: 0 })
  @IsInt()
  @Min(0)
  expReward: number;

  @ApiProperty({ description: '필요 레벨', minimum: 1 })
  @IsInt()
  @Min(1)
  levelRequired: number;

  @ApiProperty({ enum: Difficulty, description: '난이도' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
