import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RewardEntity } from './entities/reward.entity';
import { CreateRewardDto, UpdateRewardDto } from './dtos/reward.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
  ) {}

  async findAll(): Promise<RewardEntity[]> {
    return this.rewardRepository.find({
      order: { rewardId: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RewardEntity> {
    const reward = await this.rewardRepository.findOne({
      where: { rewardId: id },
    });

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    return reward;
  }

  async create(createRewardDto: CreateRewardDto): Promise<RewardEntity> {
    const reward = this.rewardRepository.create(createRewardDto);

    return this.rewardRepository.save(reward);
  }

  async update(
    id: number,
    updateRewardDto: UpdateRewardDto,
  ): Promise<RewardEntity> {
    const reward = await this.findOne(id);

    Object.assign(reward, updateRewardDto);

    return this.rewardRepository.save(reward);
  }

  async softDelete(id: number): Promise<void> {
    await this.rewardRepository.softDelete(id);
  }
}
