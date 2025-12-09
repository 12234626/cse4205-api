import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUrl,
  IsEnum,
  IsDate,
  IsOptional,
} from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/types/user-role.type';

export class UserDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ enum: UserRole, description: '사용자 역할' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ description: '아바타 URL' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string | null;

  @ApiProperty({ description: '경험치' })
  @IsInt()
  exp: number;

  @ApiProperty({ description: '오늘의 퀘스트 완료 개수' })
  @IsInt()
  todayQuest: number;

  @ApiProperty({ description: '연속 출석일수' })
  @IsInt()
  streak: number;

  @ApiProperty({ description: '레벨' })
  @IsInt()
  level: number;

  @ApiProperty({ description: '현재 레벨에서의 누적 경험치' })
  @IsInt()
  currentLevelExp: number;

  @ApiProperty({ description: '현재 레벨에서 다음 레벨까지 필요한 경험치' })
  @IsInt()
  nextLevelExp: number;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  constructor(user: UserEntity) {
    this.userId = user.userId;
    this.role = user.role;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.exp = user.exp;
    this.todayQuest = user.todayQuest;
    this.streak = user.streak;
    this.level = this.getLevel(user.exp);
    this.currentLevelExp = user.exp - this.getAccumulatedExp(this.level);
    this.nextLevelExp = this.getExpRequiredForLevel(this.level);
    this.createdAt = user.createdAt;
  }

  private getExpRequiredForLevel(level: number): number {
    return level * 10;
  }

  private getAccumulatedExp(level: number): number {
    return (10 * (level - 1) * level) / 2;
  }

  private getLevel(totalExp: number): number {
    let left = 1;
    let right = 1000;

    while (left < right) {
      const mid = (left + right) >> 1;
      const accumulatedExp = this.getAccumulatedExp(mid);

      if (accumulatedExp > totalExp) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left - 1;
  }
}
