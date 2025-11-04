import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('typeorm', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  ssl: process.env.DB_SSL === 'true',
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/../migration/**/*{.ts,.js}')],
  migrationsTableName: 'migration',
  synchronize: false,
  migrationsRun: true,
}));
