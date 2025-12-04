import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUrl,
  IsEnum,
  IsDate,
  IsOptional,
  Min,
} from 'class-validator';

import { UserEntity } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/types/user-role.type';

export class UserDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  username: string;

  @ApiProperty({ enum: UserRole, description: '사용자 역할' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: '레벨', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ description: '경험치', default: 0 })
  @IsInt()
  @Min(0)
  exp: number;

  @ApiProperty({ description: '연속 출석일수', default: 0 })
  @IsInt()
  @Min(0)
  streak: number;

  @ApiPropertyOptional({ description: '아바타 URL' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string | null;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  constructor(user: UserEntity) {
    this.userId = user.userId;
    this.username = user.username;
    this.role = user.role;
    this.streak = user.streak;
    this.level = user.level;
    this.exp = user.exp;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt;
  }
}
