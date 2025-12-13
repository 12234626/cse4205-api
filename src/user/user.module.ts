import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { MentorRequestService } from './services/mentor-request.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { MentorRequestEntity } from './entities/mentor-request.entity';
import { UserQuestModule } from 'src/user-quest/user-quest.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MentorRequestEntity]),
    UserQuestModule,
  ],
  controllers: [UserController],
  providers: [UserService, MentorRequestService],
  exports: [UserService, MentorRequestService],
})
export class UserModule {}
