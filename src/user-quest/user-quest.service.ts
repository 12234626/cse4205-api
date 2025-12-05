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
    return await this.userQuestRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await this.userService.findOne(userId);

        if (!user) {
          throw ResponseException.userNotFound();
        }

        const now = new Date();
        const today6AMUTC = new Date(now);
        today6AMUTC.setUTCHours(21, 0, 0, 0);

        if (now.getUTCHours() < 21) {
          today6AMUTC.setUTCDate(today6AMUTC.getUTCDate() - 1);
        }

        const existingQuests = await transactionalEntityManager.find(
          UserQuestEntity,
          {
            where: {
              user: { userId },
              createdAt: MoreThanOrEqual(today6AMUTC),
            },
            relations: ['quest'],
          },
        );

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

        const fixedQuestsToAssign = fixedQuests.slice(0, 2);
        const allQuestsToAssign = [...fixedQuestsToAssign, ...randomQuests];

        const assignedQuests = allQuestsToAssign.map((quest) =>
          transactionalEntityManager.create(UserQuestEntity, {
            user,
            quest,
            status: QuestStatus.PENDING,
          }),
        );

        const savedQuests =
          await transactionalEntityManager.save(assignedQuests);

        return savedQuests;
      },
    );
  }

  private getRandomQuests(quests: QuestEntity[], count: number): QuestEntity[] {
    const shuffled = [...quests];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }
}
