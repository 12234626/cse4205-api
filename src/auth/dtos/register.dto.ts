import { IsEnum, IsString } from 'class-validator';

import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

export class RegisterDto {
  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  token: string;

  @IsString()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;
}
