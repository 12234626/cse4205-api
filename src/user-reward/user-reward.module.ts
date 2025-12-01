import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRewardService } from './user-reward.service';
import { UserRewardController } from './user-reward.controller';
import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { UserModule } from 'src/user/user.module';
import { RewardModule } from 'src/reward/reward.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRewardEntity]),
    UserModule,
    RewardModule,
  ],
  controllers: [UserRewardController],
  providers: [UserRewardService],
  exports: [UserRewardService],
})
export class UserRewardModule {}
