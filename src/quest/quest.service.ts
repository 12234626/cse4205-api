import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  LessThanOrEqual,
  IsNull,
} from 'typeorm';

import { QuestEntity } from './entities/quest.entity';
import { CreateQuestDto } from './dtos/create-quest.dto';
import { UpdateQuestDto } from './dtos/update-quest.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { QuestType } from './types/quest.type';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}

  async findAll(
    options?: FindManyOptions<QuestEntity>,
  ): Promise<QuestEntity[]> {
    return this.questRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<QuestEntity>,
  ): Promise<QuestEntity | null> {
    return this.questRepository.findOne(options);
  }

  async create(createQuestDto: CreateQuestDto): Promise<QuestEntity> {
    const quest = this.questRepository.create(createQuestDto);

    return this.questRepository.save(quest);
  }

  async update(
    questId: number,
    updateQuestDto: UpdateQuestDto,
  ): Promise<QuestEntity> {
    const quest = await this.findOne({
      where: { questId },
    });

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    Object.assign(quest, updateQuestDto);

    return this.questRepository.save(quest);
  }

  async findByTypeAndLevel(
    questType: QuestType,
    maxLevel: number,
  ): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: [
        {
          questType,
          levelRequired: LessThanOrEqual(maxLevel),
        },
        {
          questType,
          levelRequired: IsNull(),
        },
      ],
    });
  }

  async softRemove(questId: number): Promise<void> {
    const quest = await this.findOne({
      where: { questId },
    });

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    await this.questRepository.softRemove(quest);
  }
}
