import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
import { UserService } from 'src/user/services/user.service';
import { QuestService } from 'src/quest/quest.service';
import { ResponseException } from 'src/common/exceptions/response.exception';

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
}
