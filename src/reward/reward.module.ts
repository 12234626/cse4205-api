import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { RewardEntity } from 'src/reward/entities/reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEntity])],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
