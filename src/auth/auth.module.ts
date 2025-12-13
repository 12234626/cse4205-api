import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';
import { UserQuestModule } from 'src/user-quest/user-quest.module';
import { TokenEntity } from './entities/token.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), UserQuestModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
