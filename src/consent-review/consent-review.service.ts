import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsentRequestService } from 'src/consent-request/consent-request.service';
import { ConsentReviewEntity } from './entities/consent-review.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConsentRequestType } from 'src/consent-request/types/consent-request-type.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class ConsentReviewService {
  constructor(
    @InjectRepository(ConsentReviewEntity)
    private consentReviewRepository: Repository<ConsentReviewEntity>,
    private consentRequestService: ConsentRequestService,
  ) {}

  async create(
    reviewer: UserEntity,
    requestType: ConsentRequestType,
    userQuestId: number,
    comment?: string,
  ): Promise<ConsentReviewEntity> {
    const consentRequest = await this.consentRequestService.findOne(
      requestType,
      userQuestId,
    );

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    if (
      (requestType === ConsentRequestType.MENTOR) !==
      (consentRequest.userQuest.user.userId === reviewer.userId)
    ) {
      throw ResponseException.forbidden();
    }

    const review = this.consentReviewRepository.create({
      reviewer,
      consentRequest,
      comment,
    });

    return this.consentReviewRepository.save(review);
  }
}
