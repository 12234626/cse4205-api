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

import { UserQuestService } from './user-quest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Controller('user-quest')
@UseGuards(JwtAuthGuard)
export class UserQuestController {
  constructor(private readonly userQuestService: UserQuestService) {}

  @Get()
  async findAll() {
    const userQuests = await this.userQuestService.findAll();

    return ResponseDto.ok<UserQuestEntity[]>(userQuests);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const userQuest = await this.userQuestService.findOne(id);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    return ResponseDto.ok<UserQuestEntity>(userQuest);
  }

  @Post()
  async create(@Body() createUserQuestDto: CreateUserQuestDto) {
    const userQuest = await this.userQuestService.create(createUserQuestDto);

    return ResponseDto.created<UserQuestEntity>(userQuest);
  }

  @Put(':id')
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
  async softDelete(@Param('id') id: number) {
    await this.userQuestService.softDelete(id);

    return ResponseDto.noContent();
  }
}
