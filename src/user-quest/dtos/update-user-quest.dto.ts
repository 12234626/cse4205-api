import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { QuestStatus } from 'src/user-quest/types/quest-status.type';

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
