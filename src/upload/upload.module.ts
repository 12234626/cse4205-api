import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConsentRequestImageEntity } from 'src/consent-request/entities/consent-request-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentRequestImageEntity])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
