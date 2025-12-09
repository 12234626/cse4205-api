import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsentReviewService } from './consent-review.service';
import { ConsentReviewController } from './consent-review.controller';
import { UserQuestModule } from 'src/user-quest/user-quest.module';
import { ConsentRequestModule } from 'src/consent-request/consent-request.module';
import { ConsentReviewEntity } from './entities/consent-review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsentReviewEntity]),
    UserQuestModule,
    ConsentRequestModule,
  ],
  controllers: [ConsentReviewController],
  providers: [ConsentReviewService],
  exports: [ConsentReviewService],
})
export class ConsentReviewModule {}
