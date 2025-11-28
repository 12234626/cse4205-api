import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

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

  async findOne(id: number): Promise<UserQuestEntity> {
    const userQuest = await this.userQuestRepository.findOne({
      where: { userQuestId: id },
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
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
    id: number,
    updateUserQuestDto: UpdateUserQuestDto,
  ): Promise<UserQuestEntity> {
    const userQuest = await this.findOne(id);
    Object.assign(userQuest, updateUserQuestDto);

    return this.userQuestRepository.save(userQuest);
  }

  async softDelete(id: number): Promise<void> {
    await this.userQuestRepository.softDelete(id);
  }
}
