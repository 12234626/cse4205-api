import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { VerificationEntity } from 'src/verification/entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationEntity])],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
