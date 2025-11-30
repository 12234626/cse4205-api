import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: {
    access: string;
    refresh: string;
  };
  expiresIn: {
    access: number;
    refresh: number;
  };
}

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: {
      access: process.env.JWT_SECRET_ACCESS!,
      refresh: process.env.JWT_SECRET_REFRESH!,
    },
    expiresIn: {
      access: 15 * 60,
      refresh: 14 * 24 * 60 * 60,
    },
  }),
);
