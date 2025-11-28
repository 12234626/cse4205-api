import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { QuestService } from 'src/quest/quest.service';
import { CreateQuestDto, UpdateQuestDto } from 'src/quest/dtos/quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  // GET /quest - 전체 퀘스트 조회
  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    // 제목으로 검색
    if (title) {
      const quests = await this.questService.searchByTitle(title);
      return ResponseDto.ok(quests);
    }

    // 카테고리로 검색
    if (category) {
      const quests = await this.questService.findByCategory(category);
      return ResponseDto.ok(quests);
    }

    // 전체 조회
    const quests = await this.questService.findAll();
    return ResponseDto.ok(quests);
  }

  // GET /quest/:id - 특정 퀘스트 조회
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const quest = await this.questService.findOne(id);
    return ResponseDto.ok(quest);
  }

  // POST /quest - 퀘스트 생성
  @Post()
  async create(@Body() createQuestDto: CreateQuestDto) {
    const quest = await this.questService.create(createQuestDto);
    return ResponseDto.created(quest);
  }

  // PUT /quest/:id - 퀘스트 수정
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    const quest = await this.questService.update(id, updateQuestDto);
    return ResponseDto.ok(quest);
  }

  // DELETE /quest/:id - 퀘스트 삭제
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.questService.remove(id);
    return ResponseDto.noContent();
  }
}
