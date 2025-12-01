import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { QuestService } from './quest.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { QuestEntity } from './entities/quest.entity';
import { CreateQuestDto, UpdateQuestDto } from './dtos/quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiBearerAuth()
@ApiTags('퀘스트')
@Controller('quest')
@UseGuards(JwtAccessAuthGuard)
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  @ApiOperation({ summary: '전체 퀘스트 조회 또는 제목/카테고리로 검색' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: '퀘스트 제목 검색어',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '퀘스트 카테고리',
  })
  @ApiResponse({
    status: 200,
    description: '퀘스트 조회 성공',
    type: [QuestEntity],
  })
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    if (title) {
      const quests = await this.questService.findByTitle(title);

      return ResponseDto.ok<QuestEntity[]>(quests);
    }

    if (category) {
      const quests = await this.questService.findByCategory(category);

      return ResponseDto.ok<QuestEntity[]>(quests);
    }

    const quests = await this.questService.findAll();

    return ResponseDto.ok<QuestEntity[]>(quests);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '퀘스트 조회 성공',
    type: QuestEntity,
  })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const quest = await this.questService.findOne(id);

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    return ResponseDto.ok<QuestEntity>(quest);
  }

  @Post()
  @ApiOperation({ summary: '새 퀘스트 생성' })
  @ApiResponse({
    status: 201,
    description: '퀘스트 생성 성공',
    type: QuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createQuestDto: CreateQuestDto) {
    const quest = await this.questService.create(createQuestDto);

    return ResponseDto.created<QuestEntity>(quest);
  }

  @Put(':id')
  @ApiOperation({ summary: '퀘스트 수정' })
  @ApiResponse({
    status: 200,
    description: '퀘스트 수정 성공',
    type: QuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    const quest = await this.questService.update(id, updateQuestDto);

    return ResponseDto.ok<QuestEntity>(quest);
  }

  @Delete(':id')
  @ApiOperation({ summary: '퀘스트 삭제' })
  @ApiResponse({ status: 204, description: '퀘스트 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async softDelete(@Param('id') id: number) {
    await this.questService.softDelete(id);

    return ResponseDto.noContent();
  }
}
