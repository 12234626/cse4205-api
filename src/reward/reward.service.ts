import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';

import { RewardEntity } from './entities/reward.entity';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
  ) {}

  async findAll(
    options?: FindManyOptions<RewardEntity>,
  ): Promise<RewardEntity[]> {
    return this.rewardRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<RewardEntity>,
  ): Promise<RewardEntity | null> {
    return this.rewardRepository.findOne(options);
  }

  async create(createRewardDto: CreateRewardDto): Promise<RewardEntity> {
    const reward = this.rewardRepository.create(createRewardDto);

    return this.rewardRepository.save(reward);
  }

  async update(
    rewardId: number,
    updateRewardDto: UpdateRewardDto,
  ): Promise<RewardEntity> {
    const reward = await this.findOne({
      where: { rewardId },
    });

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    Object.assign(reward, updateRewardDto);

    return this.rewardRepository.save(reward);
  }

  async softRemove(rewardId: number): Promise<void> {
    const reward = await this.findOne({
      where: { rewardId },
    });

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    await this.rewardRepository.softRemove(reward);
  }
}
