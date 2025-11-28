import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import typeormConfig from './config/typeorm.config';
import awsConfig from './config/aws.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { UserQuestModule } from './user-quest/user-quest.module';
import { RewardModule } from './reward/reward.module';
import { UserRewardModule } from './user-reward/user-reward.module';
import { VerificationModule } from './verification/verification.module';
import { UploadModule } from './upload/upload.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, typeormConfig, awsConfig],
    }),
    PassportModule.register({ property: 'payload' }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.getOrThrow('typeorm')),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    AuthModule,
    UserModule,
    QuestModule,
    UserQuestModule,
    RewardModule,
    UserRewardModule,
    VerificationModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
