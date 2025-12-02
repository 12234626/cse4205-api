import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

export class RegisterDto {
  @ApiProperty({ enum: Provider, description: 'OAuth 제공자' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ description: 'OAuth 액세스 토큰' })
  @IsString()
  token: string;

  @ApiProperty({ description: '사용자 닉네임' })
  @IsString()
  username: string;

  @ApiProperty({ enum: UserRole, description: '사용자 역할' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ description: '멘토 사용자 이름' })
  @IsOptional()
  @IsString()
  mentorUsername?: string;
}
