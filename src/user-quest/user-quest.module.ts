import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserQuestService } from './user-quest.service';
import { UserQuestController } from './user-quest.controller';
import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuestEntity])],
  controllers: [UserQuestController],
  providers: [UserQuestService],
})
export class UserQuestModule {}
