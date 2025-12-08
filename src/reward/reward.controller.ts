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
  ApiParam,
} from '@nestjs/swagger';

import { RewardService } from './reward.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { RewardDto } from './dtos/reward.dto';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('보상')
@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '전체 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '보상 목록 조회 성공',
    type: [RewardDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll() {
    const rewards = await this.rewardService.findAll();

    return ResponseDto.ok<RewardDto[]>(
      rewards.map((reward) => new RewardDto(reward)),
    );
  }

  @Get(':rewardId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID로 보상 조회' })
  @ApiParam({ name: 'rewardId', description: '보상 ID' })
  @ApiResponse({
    status: 200,
    description: '보상 조회 성공',
    type: RewardDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async findOne(@Param('rewardId') rewardId: number) {
    const reward = await this.rewardService.findOne({
      where: { rewardId },
    });

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    return ResponseDto.ok<RewardDto>(new RewardDto(reward));
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 보상 생성' })
  @ApiResponse({
    status: 201,
    description: '보상 생성 성공',
    type: RewardDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async create(@Body() createRewardDto: CreateRewardDto) {
    const reward = await this.rewardService.create(createRewardDto);

    return ResponseDto.created<RewardDto>(new RewardDto(reward));
  }

  @Put(':rewardId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '보상 수정' })
  @ApiParam({ name: 'rewardId', description: '보상 ID' })
  @ApiResponse({
    status: 200,
    description: '보상 수정 성공',
    type: RewardDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async update(
    @Param('rewardId') rewardId: number,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    const reward = await this.rewardService.update(rewardId, updateRewardDto);

    return ResponseDto.ok<RewardDto>(new RewardDto(reward));
  }

  @Delete(':rewardId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '보상 삭제' })
  @ApiParam({ name: 'rewardId', description: '보상 ID' })
  @ApiResponse({ status: 204, description: '보상 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '보상을 찾을 수 없음 (REWARD_NOT_FOUND)',
  })
  async softRemove(@Param('rewardId') rewardId: number) {
    await this.rewardService.softRemove(rewardId);

    return ResponseDto.noContent();
  }
}
