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
    return this.questRepository.find({
      order: { questId: 'DESC' },
    });
  }

  async searchByTitle(title: string): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: { title: Like(`%${title}%`) },
      order: { questId: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: { category },
      order: { questId: 'DESC' },
    });
  }

  async findOne(id: number): Promise<QuestEntity> {
    const quest = await this.questRepository.findOne({
      where: { questId: id },
    });

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    return quest;
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

    Object.assign(quest, updateQuestDto);

    return this.questRepository.save(quest);
  }

  async softDelete(id: number): Promise<void> {
    await this.questRepository.softDelete(id);
  }
}
