import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsDate } from 'class-validator';

import { TokenEntity } from 'src/auth/entities/token.entity';

export class TokenDto {
  @ApiProperty({ description: '토큰 ID' })
  @IsInt()
  tokenId: number;

  @ApiProperty({ description: '액세스 토큰' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ description: '생성일' })
  @IsDate()
  createdAt: Date;

  constructor(token: TokenEntity) {
    this.tokenId = token.tokenId;
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
    this.createdAt = token.createdAt;
  }
}
