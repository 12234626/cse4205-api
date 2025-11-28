import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestEntity } from 'src/quest/entities/quest.entity';
import { CreateQuestDto, UpdateQuestDto } from 'src/quest/dtos/quest.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ErrorCode } from 'src/common/types/error-code.type';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}

  // 전체 퀘스트 조회
  async findAll(): Promise<QuestEntity[]> {
    return this.questRepository.find({
      order: { questId: 'DESC' },
    });
  }

  // 제목으로 퀘스트 검색 (부분 일치)
  async searchByTitle(title: string): Promise<QuestEntity[]> {
    return this.questRepository
      .createQueryBuilder('quest')
      .where('quest.title LIKE :title', { title: `%${title}%` })
      .orderBy('quest.questId', 'DESC')
      .getMany();
  }

  // 카테고리로 퀘스트 검색 (정확히 일치)
  async findByCategory(category: string): Promise<QuestEntity[]> {
    return this.questRepository.find({
      where: { category },
      order: { questId: 'DESC' },
    });
  }

  // 특정 퀘스트 조회 (ID)
  async findOne(id: number): Promise<QuestEntity> {
    const quest = await this.questRepository.findOne({
      where: { questId: id },
    });

    if (!quest) {
      throw new ResponseException(ErrorCode.NOT_FOUND, 'Quest not found');
    }

    return quest;
  }

  // 퀘스트 생성
  async create(createQuestDto: CreateQuestDto): Promise<QuestEntity> {
    const quest = this.questRepository.create(createQuestDto);
    return this.questRepository.save(quest);
  }

  // 퀘스트 수정
  async update(
    id: number,
    updateQuestDto: UpdateQuestDto,
  ): Promise<QuestEntity> {
    const quest = await this.findOne(id);

    Object.assign(quest, updateQuestDto);

    return this.questRepository.save(quest);
  }

  // 퀘스트 삭제
  async remove(id: number): Promise<void> {
    const quest = await this.findOne(id);
    await this.questRepository.remove(quest);
  }
}
