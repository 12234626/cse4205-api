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
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UserQuestService } from './user-quest.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
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
    description: '사용자 퀘스트 조회 성공',
    type: [UserQuestEntity],
  })
  async findAll() {
    const userQuests = await this.userQuestService.findAll();

    return ResponseDto.ok<UserQuestEntity[]>(userQuests);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: 'ID로 사용자 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 조회 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const userQuest = await this.userQuestService.findOne(id);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    return ResponseDto.ok<UserQuestEntity>(userQuest);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '새 사용자 퀘스트 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 퀘스트 생성 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createUserQuestDto: CreateUserQuestDto) {
    const userQuest = await this.userQuestService.create(createUserQuestDto);

    return ResponseDto.created<UserQuestEntity>(userQuest);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '사용자 퀘스트 수정' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 수정 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateUserQuestDto: UpdateUserQuestDto,
  ) {
    const userQuest = await this.userQuestService.update(
      id,
      updateUserQuestDto,
    );

    return ResponseDto.ok<UserQuestEntity>(userQuest);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '사용자 퀘스트 삭제' })
  @ApiResponse({ status: 204, description: '사용자 퀘스트 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async softRemove(@Param('id') id: number) {
    await this.userQuestService.softRemove(id);

    return ResponseDto.noContent();
  }

  @Post('daily/assign')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '오늘의 일일 퀘스트 할당' })
  @ApiResponse({
    status: 201,
    description: '일일 퀘스트 할당 성공',
    type: [UserQuestEntity],
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

    return ResponseDto.created<UserQuestEntity[]>(userQuests);
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
  @ApiResponse({
    status: 500,
    description: '서버 오류',
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
}
