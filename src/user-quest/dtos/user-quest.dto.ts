import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsEnum, IsDate, IsOptional } from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { QuestStatus } from 'src/user-quest/types/quest-status.type';
import { UserDto } from 'src/user/dtos/user.dto';
import { QuestDto } from 'src/quest/dtos/quest.dto';

export class UserQuestDto {
  @ApiProperty({ description: '사용자 퀘스트 ID' })
  @IsInt()
  userQuestId: number;

  @ApiProperty({ enum: QuestStatus, description: '퀘스트 진행 상태' })
  @IsEnum(QuestStatus)
  status: QuestStatus;

  @ApiPropertyOptional({ description: '퀘스트 완료 시간' })
  @IsDate()
  @IsOptional()
  completedAt: Date | null;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({ description: '사용자', type: () => UserDto })
  user: UserDto;

  @ApiPropertyOptional({ description: '퀘스트', type: () => QuestDto })
  quest: QuestDto;

  constructor(userQuest: UserQuestEntity) {
    this.userQuestId = userQuest.userQuestId;
    this.status = userQuest.status;
    this.completedAt = userQuest.completedAt;
    this.createdAt = userQuest.createdAt;
    this.user = new UserDto(userQuest.user);
    this.quest = new QuestDto(userQuest.quest);
  }
}
