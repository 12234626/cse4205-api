import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { RewardEntity } from './entities/reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEntity])],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
