import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';

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

  async findAll(options?: FindManyOptions<ConsentReviewEntity>) {
    return this.consentReviewRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<ConsentReviewEntity>,
  ): Promise<ConsentReviewEntity | null> {
    return this.consentReviewRepository.findOne(options);
  }

  async create(
    reviewer: UserEntity,
    requestType: ConsentRequestType,
    userQuestId: number,
    comment?: string,
  ): Promise<ConsentReviewEntity> {
    const consentRequest = await this.consentRequestService.findOne({
      where: { requestType, userQuest: { userQuestId } },
      relations: ['author', 'author.mentor', 'images', 'reviews'],
    });

    if (!consentRequest) {
      throw ResponseException.consentRequestNotFound();
    }

    const mentor = consentRequest.author.mentor;

    if (
      (requestType === ConsentRequestType.MENTOR) !==
      (mentor?.userId === reviewer.userId)
    ) {
      throw ResponseException.forbidden();
    }

    const review = this.consentReviewRepository.create({
      reviewer,
      consentRequest,
      comment,
    });

    await this.consentReviewRepository.save(review);

    return (await this.findOne({
      where: { consentReviewId: review.consentReviewId },
      relations: ['reviewer'],
    }))!;
  }
}
