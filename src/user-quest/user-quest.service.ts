import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
import { UserService } from 'src/user/services/user.service';
import { QuestService } from 'src/quest/quest.service';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { QuestType } from 'src/quest/types/quest.type';
import { QuestStatus } from './types/quest-status.type';
import { QuestEntity } from 'src/quest/entities/quest.entity';

@Injectable()
export class UserQuestService {
  constructor(
    @InjectRepository(UserQuestEntity)
    private readonly userQuestRepository: Repository<UserQuestEntity>,
    private readonly userService: UserService,
    private readonly questService: QuestService,
  ) {}

  async findAll(): Promise<UserQuestEntity[]> {
    return this.userQuestRepository.find();
  }

  async findOne(id: number): Promise<UserQuestEntity | null> {
    const userQuest = await this.userQuestRepository.findOne({
      where: { userQuestId: id },
    });

    return userQuest;
  }

  async create(
    createUserQuestDto: CreateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const user = await this.userService.findOne(createUserQuestDto.userId);

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const quest = await this.questService.findOne(createUserQuestDto.questId);

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    const userQuest = this.userQuestRepository.create({
      user,
      quest,
      status: createUserQuestDto.status,
    });

    return this.userQuestRepository.save(userQuest);
  }

  async update(
    id: number,
    updateUserQuestDto: UpdateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const userQuest = await this.findOne(id);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    Object.assign(userQuest, updateUserQuestDto);

    return this.userQuestRepository.save(userQuest);
  }

  async softRemove(id: number): Promise<void> {
    const userQuest = await this.findOne(id);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    await this.userQuestRepository.softRemove(userQuest);
  }

  async assignDailyQuests(userId: number): Promise<UserQuestEntity[]> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const now = new Date();
    const today6AM = new Date(now);
    today6AM.setHours(6, 0, 0, 0);

    if (now.getHours() < 6) {
      today6AM.setDate(today6AM.getDate() - 1);
    }

    const existingQuests = await this.userQuestRepository.find({
      where: {
        user: { userId },
        createdAt: MoreThanOrEqual(today6AM),
      },
      relations: ['quest'],
    });

    if (existingQuests.length > 0) {
      return existingQuests;
    }

    const allQuests = await this.questService.findAll();

    const fixedQuests = allQuests.filter(
      (quest) =>
        quest.questType === QuestType.DAILY &&
        (quest.title.includes('출석') || quest.title.includes('검증')),
    );

    const randomQuestPool = allQuests.filter(
      (quest) =>
        quest.questType === QuestType.DAILY &&
        quest.levelRequired <= user.level &&
        !quest.title.includes('출석') &&
        !quest.title.includes('검증'),
    );

    if (fixedQuests.length < 2) {
      throw ResponseException.questNotFound();
    }

    if (randomQuestPool.length < 2) {
      throw ResponseException.questNotFound();
    }

    const randomQuests = this.getRandomQuests(randomQuestPool, 2);

    const selectedQuests = [...fixedQuests.slice(0, 2), ...randomQuests];

    const assignedQuests: UserQuestEntity[] = [];

    for (const quest of selectedQuests) {
      const userQuest = this.userQuestRepository.create({
        user,
        quest,
        status: QuestStatus.PENDING,
      });

      const saved = await this.userQuestRepository.save(userQuest);
      assignedQuests.push(saved);
    }

    return assignedQuests;
  }

  private getRandomQuests(quests: QuestEntity[], count: number): QuestEntity[] {
    const shuffled = [...quests].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
