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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { RewardService } from './reward.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { RewardEntity } from './entities/reward.entity';
import { CreateRewardDto, UpdateRewardDto } from './dtos/reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiBearerAuth()
@ApiTags('보상')
@Controller('reward')
@UseGuards(JwtAccessAuthGuard)
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @ApiOperation({ summary: '전체 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '보상 조회 성공',
    type: [RewardEntity],
  })
  async findAll() {
    const rewards = await this.rewardService.findAll();

    return ResponseDto.ok<RewardEntity[]>(rewards);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '보상 조회 성공',
    type: RewardEntity,
  })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const reward = await this.rewardService.findOne(id);

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    return ResponseDto.ok<RewardEntity>(reward);
  }

  @Post()
  @ApiOperation({ summary: '새 보상 생성' })
  @ApiResponse({
    status: 201,
    description: '보상 생성 성공',
    type: RewardEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createRewardDto: CreateRewardDto) {
    const reward = await this.rewardService.create(createRewardDto);

    return ResponseDto.created<RewardEntity>(reward);
  }

  @Put(':id')
  @ApiOperation({ summary: '보상 수정' })
  @ApiResponse({
    status: 200,
    description: '보상 수정 성공',
    type: RewardEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    const reward = await this.rewardService.update(id, updateRewardDto);

    return ResponseDto.ok<RewardEntity>(reward);
  }

  @Delete(':id')
  @ApiOperation({ summary: '보상 삭제' })
  @ApiResponse({ status: 204, description: '보상 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async softDelete(@Param('id') id: number) {
    await this.rewardService.softDelete(id);

    return ResponseDto.noContent();
  }
}
