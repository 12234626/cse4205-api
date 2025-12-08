import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { QuestType, Difficulty } from 'src/quest/types/quest.type';

export class UpdateQuestDto {
  @ApiPropertyOptional({ description: '퀘스트 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '퀘스트 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '퀘스트 카테고리' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ enum: QuestType, description: '퀘스트 유형' })
  @IsOptional()
  @IsEnum(QuestType)
  questType?: QuestType;

  @ApiPropertyOptional({ description: '획득 경험치', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  expReward?: number;

  @ApiPropertyOptional({ description: '필요 레벨', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  levelRequired?: number;

  @ApiPropertyOptional({ enum: Difficulty, description: '난이도' })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
}
