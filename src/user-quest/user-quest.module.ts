import { Module } from '@nestjs/common';
import { UserQuestService } from './user-quest.service';
import { UserQuestController } from './user-quest.controller';

@Module({
  controllers: [UserQuestController],
  providers: [UserQuestService],
})
export class UserQuestModule {}
