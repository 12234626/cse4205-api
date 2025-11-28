import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { VerificationEntity } from 'src/verification/entities/verification.entity';
import { VerificationImageEntity } from 'src/verification/entities/verification-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationEntity, VerificationImageEntity]),
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
