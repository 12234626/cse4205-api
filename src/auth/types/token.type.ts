import { IsNumber, IsString, IsEnum } from 'class-validator';

import { UserRole } from 'src/user/types/user-role.type';

export class Payload {
  @IsNumber()
  sub: number;

  @IsEnum(UserRole)
  role: UserRole;
}

export type TokenType = 'access' | 'refresh';

export class TokenPair {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
