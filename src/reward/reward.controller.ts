import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { RewardService } from './reward.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RewardEntity } from './entities/reward.entity';
import { CreateRewardDto, UpdateRewardDto } from './dtos/reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('reward')
@UseGuards(JwtAuthGuard)
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async findAll() {
    const rewards = await this.rewardService.findAll();

    return ResponseDto.ok<RewardEntity[]>(rewards);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const reward = await this.rewardService.findOne(id);

    return ResponseDto.ok<RewardEntity>(reward);
  }

  @Post()
  async create(@Body() createRewardDto: CreateRewardDto) {
    const reward = await this.rewardService.create(createRewardDto);

    return ResponseDto.created<RewardEntity>(reward);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    const reward = await this.rewardService.update(id, updateRewardDto);

    return ResponseDto.ok<RewardEntity>(reward);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    await this.rewardService.softDelete(id);

    return ResponseDto.noContent();
  }
}
