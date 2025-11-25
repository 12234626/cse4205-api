import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { QuestEntity } from 'src/quest/entities/quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestEntity])],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
