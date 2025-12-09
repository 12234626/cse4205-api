import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UserQuestService } from './user-quest.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { UserQuestDto } from './dtos/user-quest.dto';
import { CreateUserQuestDto } from './dtos/create-user-quest.dto';
import { UpdateUserQuestDto } from './dtos/update-user-quest.dto';
import { AssignAllResponseDto } from './dtos/assign-all-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { UserService } from 'src/user/services/user.service';

@ApiTags('사용자 퀘스트')
@Controller('user-quest')
export class UserQuestController {
  constructor(
    private readonly userQuestService: UserQuestService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '전체 사용자 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 목록 조회 성공',
    type: [UserQuestDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll() {
    const userQuests = await this.userQuestService.findAll();

    return ResponseDto.ok<UserQuestDto[]>(
      userQuests.map((userQuest) => new UserQuestDto(userQuest)),
    );
  }

  @Get(':userQuestId')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'ID로 사용자 퀘스트 조회' })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 조회 성공',
    type: UserQuestDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async findOne(@Param('userQuestId') userQuestId: number) {
    const userQuest = await this.userQuestService.findOne({
      where: { userQuestId },
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    return ResponseDto.ok<UserQuestDto>(new UserQuestDto(userQuest));
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '새 사용자 퀘스트 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 퀘스트 생성 성공',
    type: UserQuestDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async create(@Body() createUserQuestDto: CreateUserQuestDto) {
    const userQuest = await this.userQuestService.create(createUserQuestDto);

    return ResponseDto.created<UserQuestDto>(new UserQuestDto(userQuest));
  }

  @Put(':userQuestId')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '사용자 퀘스트 수정' })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 수정 성공',
    type: UserQuestDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async update(
    @Param('userQuestId') userQuestId: number,
    @Body() updateUserQuestDto: UpdateUserQuestDto,
  ) {
    const userQuest = await this.userQuestService.update(
      userQuestId,
      updateUserQuestDto,
    );

    return ResponseDto.ok<UserQuestDto>(new UserQuestDto(userQuest));
  }

  @Delete(':userQuestId')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '사용자 퀘스트 삭제' })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({ status: 204, description: '사용자 퀘스트 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async softRemove(@Param('userQuestId') userQuestId: number) {
    await this.userQuestService.softRemove(userQuestId);

    return ResponseDto.noContent();
  }

  @Post('daily/assign')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '오늘의 일일 퀘스트 할당' })
  @ApiResponse({
    status: 201,
    description: '일일 퀘스트 할당 성공',
    type: [UserQuestDto],
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (UNAUTHORIZED)',
  })
  @ApiResponse({
    status: 404,
    description: '사용자 또는 퀘스트를 찾을 수 없음 (NOT_FOUND)',
  })
  async assignDailyQuests(@Req() req: Request) {
    const userQuests = await this.userQuestService.assignDailyQuests(
      req.user.userId,
    );

    return ResponseDto.created<UserQuestDto[]>(
      userQuests.map((userQuest) => new UserQuestDto(userQuest)),
    );
  }

  @Post('daily/assign-all')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: '모든 사용자 일일 퀘스트 할당 (Lambda용)' })
  @ApiResponse({
    status: 200,
    description: '일일 퀘스트 할당 완료',
    type: AssignAllResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'API 키 인증 실패',
  })
  async assignAllDailyQuests() {
    const users = await this.userService.findAll();

    const results = await Promise.allSettled(
      users.map((user) => this.userQuestService.assignDailyQuests(user.userId)),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    const response = new AssignAllResponseDto();
    response.message = '일일 퀘스트 할당 완료';
    response.successful = successful;
    response.failed = failed;
    response.total = users.length;

    return ResponseDto.ok<AssignAllResponseDto>(response);
  }

  @Post(':userQuestId/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '퀘스트 완료 (출석 버튼 등)' })
  @ApiParam({ name: 'userQuestId', description: '사용자 퀘스트 ID' })
  @ApiResponse({
    status: 200,
    description: '퀘스트 완료 성공',
    type: UserQuestDto,
  })
  @ApiResponse({
    status: 400,
    description: '이미 완료된 퀘스트 (VALIDATION_ERROR)',
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async completeQuest(
    @Req() req: Request,
    @Param('userQuestId') userQuestId: number,
  ) {
    const userQuest = await this.userQuestService.findOne({
      where: { userQuestId, user: { userId: req.user.userId } },
      relations: ['user', 'quest'],
    });

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    const completedQuest = await this.userQuestService.complete(userQuest);

    return ResponseDto.ok<UserQuestDto>(new UserQuestDto(completedQuest));
  }
}
