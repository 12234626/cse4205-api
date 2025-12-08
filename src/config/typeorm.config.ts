import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { readFileSync } from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
    ssl: process.env.DB_SSL_CERT_PATH
      ? {
          ca: readFileSync(
            join(__dirname, '/../', process.env.DB_SSL_CERT_PATH),
          ).toString(),
        }
      : false,
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../migration/**/*{.ts,.js}')],
    migrationsTableName: 'migration',
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    migrationsRun: true,
  }),
);
