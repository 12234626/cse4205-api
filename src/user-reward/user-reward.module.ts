import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRewardService } from './user-reward.service';
import { UserRewardController } from './user-reward.controller';
import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRewardEntity])],
  controllers: [UserRewardController],
  providers: [UserRewardService],
  exports: [UserRewardService],
})
export class UserRewardModule {}
