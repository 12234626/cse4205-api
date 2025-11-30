import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';
import { TokenEntity } from './entities/token.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
