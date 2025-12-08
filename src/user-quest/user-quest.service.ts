import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  FindOneOptions,
  FindManyOptions,
} from 'typeorm';

import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto } from './dtos/create-user-quest.dto';
import { UpdateUserQuestDto } from './dtos/update-user-quest.dto';
import { UserService } from 'src/user/services/user.service';
import { QuestService } from 'src/quest/quest.service';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { QuestType } from 'src/quest/types/quest.type';
import { QuestStatus } from './types/quest-status.type';
import { QuestEntity } from 'src/quest/entities/quest.entity';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class UserQuestService {
  constructor(
    @InjectRepository(UserQuestEntity)
    private readonly userQuestRepository: Repository<UserQuestEntity>,
    private readonly userService: UserService,
    private readonly questService: QuestService,
  ) {}

  async findAll(
    options?: FindManyOptions<UserQuestEntity>,
  ): Promise<UserQuestEntity[]> {
    return this.userQuestRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<UserQuestEntity>,
  ): Promise<UserQuestEntity | null> {
    return this.userQuestRepository.findOne(options);
  }

  async create(
    createUserQuestDto: CreateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const user = await this.userService.findOne({
      where: { userId: createUserQuestDto.userId },
    });

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const quest = await this.questService.findOne({
      where: { questId: createUserQuestDto.questId },
    });

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    const userQuest = this.userQuestRepository.create({
      user,
      quest,
      status: createUserQuestDto.status,
    });

    await this.userQuestRepository.save(userQuest);

    return (await this.findOne({
      where: { userQuestId: userQuest.userQuestId },
      relations: ['user', 'quest'],
    }))!;
  }

  async update(
    userQuestId: number,
    updateUserQuestDto: UpdateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const userQuest = await this.findOne({
      where: { userQuestId },
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    Object.assign(userQuest, updateUserQuestDto);
    await this.userQuestRepository.save(userQuest);

    return (await this.findOne({
      where: { userQuestId },
      relations: ['user', 'quest'],
    }))!;
  }

  async softRemove(userQuestId: number): Promise<void> {
    const userQuest = await this.findOne({
      where: { userQuestId },
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    await this.userQuestRepository.softRemove(userQuest);
  }

  async assignDailyQuests(userId: number): Promise<UserQuestEntity[]> {
    return await this.userQuestRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await this.userService.findOne({
          where: { userId },
        });

        if (!user) {
          throw ResponseException.userNotFound();
        }

        const now = new Date();
        const today6AMKST = new Date(now);
        today6AMKST.setUTCHours(21, 0, 0, 0);

        if (now.getUTCHours() < 21) {
          today6AMKST.setUTCDate(today6AMKST.getUTCDate() - 1);
        }

        const existingQuests = await transactionalEntityManager.find(
          UserQuestEntity,
          {
            where: {
              user: { userId },
              createdAt: MoreThanOrEqual(today6AMKST),
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
            quest.questType === QuestType.DAILY && quest.title.includes('출석'),
        );

        const randomQuestPool = allQuests.filter(
          (quest) =>
            quest.questType === QuestType.DAILY &&
            quest.levelRequired <= new UserDto(user).level &&
            !quest.title.includes('출석'),
        );

        if (fixedQuests.length < 1) {
          throw ResponseException.questNotFound();
        }

        if (randomQuestPool.length < 3) {
          throw ResponseException.questNotFound();
        }

        const randomQuests = this.getRandomQuests(randomQuestPool, 3);

        const fixedQuestsToAssign = fixedQuests.slice(0, 1);
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
