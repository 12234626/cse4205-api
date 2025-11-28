import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { QuestType, Difficulty } from 'src/quest/types/quest.type';

export class CreateQuestDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsString()
  @MaxLength(100)
  category: string;

  @IsEnum(QuestType)
  questType: QuestType;

  @IsInt()
  @Min(0)
  expReward: number;

  @IsInt()
  @Min(1)
  levelRequired: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}

export class UpdateQuestDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsEnum(QuestType)
  questType?: QuestType;

  @IsOptional()
  @IsInt()
  @Min(0)
  expReward?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  levelRequired?: number;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
}
