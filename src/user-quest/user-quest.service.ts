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
        const today6AM = new Date(now);
        today6AM.setHours(6, 0, 0, 0);

        if (now.getHours() < 6) {
          today6AM.setDate(today6AM.getDate() - 1);
        }

        const existingQuests = await transactionalEntityManager.find(
          UserQuestEntity,
          {
            where: {
              user: { userId },
              createdAt: MoreThanOrEqual(today6AM),
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

        const yesterday6AM = new Date(today6AM);
        yesterday6AM.setDate(yesterday6AM.getDate() - 1);

        const previousFixedQuests = await transactionalEntityManager.find(
          UserQuestEntity,
          {
            where: {
              user: { userId },
              createdAt: MoreThanOrEqual(yesterday6AM),
            },
            relations: ['quest'],
          },
        );

        const assignedQuests: UserQuestEntity[] = [];

        const fixedQuestsToAssign = fixedQuests.slice(0, 2);
        for (const fixedQuest of fixedQuestsToAssign) {
          const existingFixed = previousFixedQuests.find(
            (pq) =>
              pq.quest.questId === fixedQuest.questId &&
              (pq.quest.title.includes('출석') ||
                pq.quest.title.includes('검증')),
          );

          if (existingFixed) {
            existingFixed.status = QuestStatus.PENDING;
            existingFixed.completedAt = undefined;
            existingFixed.createdAt = new Date();
            assignedQuests.push(existingFixed);
          } else {
            const userQuest = transactionalEntityManager.create(
              UserQuestEntity,
              {
                user,
                quest: fixedQuest,
                status: QuestStatus.PENDING,
              },
            );
            assignedQuests.push(userQuest);
          }
        }

        const randomQuests = this.getRandomQuests(randomQuestPool, 2);
        const randomUserQuests = randomQuests.map((quest) =>
          transactionalEntityManager.create(UserQuestEntity, {
            user,
            quest,
            status: QuestStatus.PENDING,
          }),
        );

        assignedQuests.push(...randomUserQuests);

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
