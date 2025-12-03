import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUrl,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

import { UserRole } from 'src/user/types/user-role.type';

export class PublicProfileDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: '사용자 닉네임' })
  @IsString()
  username: string;

  @ApiProperty({ enum: UserRole, description: '사용자 역할' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ description: '아바타 URL' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string | null;

  @ApiProperty({ description: '레벨', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ description: '경험치', default: 0 })
  @IsInt()
  @Min(0)
  exp: number;
}
