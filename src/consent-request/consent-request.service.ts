import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

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
    options?: FindManyOptions<ConsentRequestEntity>,
  ): Promise<ConsentRequestEntity[]> {
    return this.consentRequestRepository.find(options);
  }

  async findOne(
    option: FindOneOptions<ConsentRequestEntity>,
  ): Promise<ConsentRequestEntity | null> {
    return this.consentRequestRepository.findOne(option);
  }

  async create(
    author: UserEntity,
    requestType: ConsentRequestType,
    userQuestId: number,
    title?: string,
    content?: string,
  ): Promise<ConsentRequestEntity> {
    const userQuest = await this.userQuestService.findOne({
      where: { userQuestId },
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    const consentRequest = await this.findOne({
      where: { requestType, userQuest: { userQuestId } },
    });

    if (consentRequest) {
      throw ResponseException.consentRequestAlreadyExists();
    }

    const newConsentRequest = this.consentRequestRepository.create({
      userQuest,
      requestType,
      author,
      title: requestType === ConsentRequestType.COMMUNITY ? title : undefined,
      content:
        requestType === ConsentRequestType.COMMUNITY ? content : undefined,
    });

    await this.consentRequestRepository.save(newConsentRequest);

    return (await this.findOne({
      where: { requestType, userQuest: { userQuestId } },
      relations: ['author', 'images', 'reviews', 'userQuest'],
    }))!;
  }
}
