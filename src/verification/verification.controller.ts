import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { VerificationService } from 'src/verification/verification.service';
import {
  CreateVerificationDto,
  UpdateVerificationDto,
} from 'src/verification/dtos/verification.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  async findAll() {
    const verifications = await this.verificationService.findAll();
    return ResponseDto.ok(verifications);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const verification = await this.verificationService.findOne(id);
    return ResponseDto.ok(verification);
  }

  @Post()
  async create(@Body() createVerificationDto: CreateVerificationDto) {
    const verification = await this.verificationService.create(
      createVerificationDto,
    );
    return ResponseDto.created(verification);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    const verification = await this.verificationService.update(
      id,
      updateVerificationDto,
    );
    return ResponseDto.ok(verification);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.verificationService.remove(id);
    return ResponseDto.noContent();
  }
}
