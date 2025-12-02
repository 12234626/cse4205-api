import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { MentorRequestService } from './services/mentor-request.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { MentorRequestEntity } from './entities/mentor-request.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MentorRequestEntity])],
  controllers: [UserController],
  providers: [UserService, MentorRequestService],
  exports: [UserService, MentorRequestService],
})
export class UserModule {}
