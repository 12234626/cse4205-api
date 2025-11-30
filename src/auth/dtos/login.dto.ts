import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Provider } from 'src/user/types/provider.type';

export class LoginDto {
  @ApiProperty({ enum: Provider, description: 'OAuth 제공자' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ description: 'OAuth 액세스 토큰' })
  @IsString()
  token: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT 액세스 토큰' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: 'JWT 리프레시 토큰' })
  @IsString()
  refreshToken: string;
}
