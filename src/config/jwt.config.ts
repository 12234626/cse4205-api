import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
}

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET!,
  }),
);
