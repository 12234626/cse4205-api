import { IsInt, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { QuestStatus } from 'src/user-quest/types/quest-status.type';

export class CreateUserQuestDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '퀘스트 ID' })
  @IsInt()
  questId: number;

  @ApiPropertyOptional({ enum: QuestStatus, description: '퀘스트 진행 상태' })
  @IsOptional()
  @IsEnum(QuestStatus)
  status?: QuestStatus;
}

export class UpdateUserQuestDto {
  @ApiPropertyOptional({ enum: QuestStatus, description: '퀘스트 진행 상태' })
  @IsOptional()
  @IsEnum(QuestStatus)
  status?: QuestStatus;

  @ApiPropertyOptional({ description: '퀘스트 완료 시간' })
  @IsOptional()
  @IsDate()
  completedAt?: Date;
}
