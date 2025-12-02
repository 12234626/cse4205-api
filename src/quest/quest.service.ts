import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { QuestEntity } from './entities/quest.entity';
import { CreateQuestDto, UpdateQuestDto } from './dtos/quest.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}

  async findAll(): Promise<QuestEntity[]> {
    return this.questRepository.find();
  }

  async findOne(id: number): Promise<QuestEntity | null> {
    const quest = await this.questRepository.findOne({
      where: { questId: id },
    });

    return quest;
  }

  async findByTitle(title: string): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: { title: Like(`%${title}%`) },
    });
  }

  async findByCategory(category: string): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: { category },
    });
  }

  async create(createQuestDto: CreateQuestDto): Promise<QuestEntity> {
    const quest = this.questRepository.create(createQuestDto);

    return this.questRepository.save(quest);
  }

  async update(
    id: number,
    updateQuestDto: UpdateQuestDto,
  ): Promise<QuestEntity> {
    const quest = await this.findOne(id);

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    Object.assign(quest, updateQuestDto);

    return this.questRepository.save(quest);
  }

  async softRemove(id: number): Promise<void> {
    const quest = await this.findOne(id);

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    await this.questRepository.softRemove(quest);
  }
}
