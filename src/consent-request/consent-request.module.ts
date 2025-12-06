import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsentRequestService } from './consent-request.service';
import { ConsentRequestController } from './consent-request.controller';
import { ConsentRequestEntity } from './entities/consent-request.entity';
import { ConsentRequestImageEntity } from './entities/consent-request-image.entity';
import { UserQuestModule } from 'src/user-quest/user-quest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsentRequestEntity, ConsentRequestImageEntity]),
    UserQuestModule,
  ],
  controllers: [ConsentRequestController],
  providers: [ConsentRequestService],
  exports: [ConsentRequestService],
})
export class ConsentRequestModule {}
