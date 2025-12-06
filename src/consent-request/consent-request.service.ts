import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserQuestService } from 'src/user-quest/user-quest.service';
import { ConsentRequestEntity } from './entities/consent-request.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConsentRequestType } from './types/consent-request-type.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class ConsentRequestService {
  constructor(
    @InjectRepository(ConsentRequestEntity)
    private consentRequestRepository: Repository<ConsentRequestEntity>,
    private readonly userQuestService: UserQuestService,
  ) {}

  async findAll(
    requestType: ConsentRequestType,
  ): Promise<ConsentRequestEntity[]> {
    return this.consentRequestRepository.find({
      where: { requestType },
    });
  }

  async findOne(
    requestType: ConsentRequestType,
    userQuestId: number,
  ): Promise<ConsentRequestEntity | null> {
    return this.consentRequestRepository.findOne({
      where: { userQuest: { userQuestId }, requestType },
    });
  }

  async create(
    author: UserEntity,
    requestType: ConsentRequestType,
    userQuestId: number,
    title?: string,
    content?: string,
  ): Promise<ConsentRequestEntity> {
    const userQuest = await this.userQuestService.findOneWithQuest(userQuestId);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    const existingConsentRequest = await this.findOne(requestType, userQuestId);

    if (existingConsentRequest) {
      throw ResponseException.consentRequestAlreadyExists();
    }

    const request = this.consentRequestRepository.create({
      userQuest: { userQuestId },
      requestType,
      author,
      title: requestType === ConsentRequestType.COMMUNITY ? title : undefined,
      content:
        requestType === ConsentRequestType.COMMUNITY ? content : undefined,
    });

    return this.consentRequestRepository.save(request);
  }
}
