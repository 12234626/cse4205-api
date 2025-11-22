import { IsNumber, IsEnum, IsString } from 'class-validator';

import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

export class Payload {
  @IsNumber()
  sub: number;

  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  providerId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
