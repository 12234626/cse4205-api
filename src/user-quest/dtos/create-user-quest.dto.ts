import { IsInt, IsEnum, IsOptional } from 'class-validator';
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
