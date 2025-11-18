import { Module } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';
import { UserRewardController } from './user-reward.controller';

@Module({
  controllers: [UserRewardController],
  providers: [UserRewardService],
})
export class UserRewardModule {}
