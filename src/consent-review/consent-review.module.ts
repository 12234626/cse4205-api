import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsentReviewService } from './consent-review.service';
import { ConsentReviewController } from './consent-review.controller';
import { ConsentReviewEntity } from './entities/consent-review.entity';
import { ConsentRequestModule } from 'src/consent-request/consent-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsentReviewEntity]),
    ConsentRequestModule,
  ],
  controllers: [ConsentReviewController],
  providers: [ConsentReviewService],
  exports: [ConsentReviewService],
})
export class ConsentReviewModule {}
