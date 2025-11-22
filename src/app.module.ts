import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import typeormConfig from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { UserQuestModule } from './user-quest/user-quest.module';
import { RewardModule } from './reward/reward.module';
import { UserRewardModule } from './user-reward/user-reward.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('typeorm')),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    UserModule,
    QuestModule,
    UserQuestModule,
    RewardModule,
    UserRewardModule,
    VerificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
