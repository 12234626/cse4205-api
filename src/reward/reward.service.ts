import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RewardEntity } from 'src/reward/entities/reward.entity';
import { CreateRewardDto, UpdateRewardDto } from 'src/reward/dtos/reward.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ErrorCode } from 'src/common/types/error-code.type';

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
      throw new ResponseException(ErrorCode.NOT_FOUND, 'Reward not found');
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

  async remove(id: number): Promise<void> {
    const reward = await this.findOne(id);
    await this.rewardRepository.remove(reward);
  }
}
