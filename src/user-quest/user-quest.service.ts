import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import {
  CreateUserQuestDto,
  UpdateUserQuestDto,
} from 'src/user-quest/dtos/user-quest.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ErrorCode } from 'src/common/types/error-code.type';

@Injectable()
export class UserQuestService {
  constructor(
    @InjectRepository(UserQuestEntity)
    private readonly userQuestRepository: Repository<UserQuestEntity>,
  ) {}

  async findAll(): Promise<UserQuestEntity[]> {
    return this.userQuestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UserQuestEntity> {
    const userQuest = await this.userQuestRepository.findOne({
      where: { userQuestId: id },
    });

    if (!userQuest) {
      throw new ResponseException(ErrorCode.NOT_FOUND, 'UserQuest not found');
    }

    return userQuest;
  }

  async create(
    createUserQuestDto: CreateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const userQuest = this.userQuestRepository.create(createUserQuestDto);
    return this.userQuestRepository.save(userQuest);
  }

  async update(
    id: string,
    updateUserQuestDto: UpdateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const userQuest = await this.findOne(id);
    Object.assign(userQuest, updateUserQuestDto);
    return this.userQuestRepository.save(userQuest);
  }

  async remove(id: string): Promise<void> {
    const userQuest = await this.findOne(id);
    await this.userQuestRepository.remove(userQuest);
  }
}
