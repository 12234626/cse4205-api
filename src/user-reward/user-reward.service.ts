import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/user-reward.dto';

@Injectable()
export class UserRewardService {
  constructor(
    @InjectRepository(UserRewardEntity)
    private readonly userRewardRepository: Repository<UserRewardEntity>,
  ) {}

  async findAll(): Promise<UserRewardEntity[]> {
    return this.userRewardRepository.find();
  }

  async findOne(id: number): Promise<UserRewardEntity | null> {
    const userReward = await this.userRewardRepository.findOne({
      where: { userRewardId: id },
    });

    return userReward;
  }

  async create(
    createUserRewardDto: CreateUserRewardDto,
  ): Promise<UserRewardEntity> {
    const userReward = this.userRewardRepository.create(createUserRewardDto);

    return this.userRewardRepository.save(userReward);
  }

  async softDelete(id: number): Promise<void> {
    await this.userRewardRepository.softDelete(id);
  }
}
