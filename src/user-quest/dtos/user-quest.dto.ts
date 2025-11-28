import { IsInt, IsEnum, IsOptional, IsDate } from 'class-validator';

import { QuestStatus } from 'src/user-quest/types/quest-status.type';

export class CreateUserQuestDto {
  @IsInt()
  userId: number;

  @IsInt()
  questId: number;

  @IsOptional()
  @IsEnum(QuestStatus)
  status?: QuestStatus;
}

export class UpdateUserQuestDto {
  @IsOptional()
  @IsEnum(QuestStatus)
  status?: QuestStatus;

  @IsOptional()
  @IsDate()
  completedAt?: Date;
}
