import { IsEnum, IsString } from 'class-validator';

import { Provider } from 'src/user/types/provider.type';

export class LoginDto {
  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  token: string;
}

export class LoginResponseDto {
  @IsString()
  token: string;
}
