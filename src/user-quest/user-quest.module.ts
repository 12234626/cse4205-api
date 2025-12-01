import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserQuestService } from './user-quest.service';
import { UserQuestController } from './user-quest.controller';
import { UserQuestEntity } from './entities/user-quest.entity';
import { UserModule } from 'src/user/user.module';
import { QuestModule } from 'src/quest/quest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserQuestEntity]),
    UserModule,
    QuestModule,
  ],
  controllers: [UserQuestController],
  providers: [UserQuestService],
  exports: [UserQuestService],
})
export class UserQuestModule {}
