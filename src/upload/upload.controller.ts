import { Controller, UseGuards, Post, Body } from '@nestjs/common';

import { UploadService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  PresignedUrlDto,
  PresignedUrlResponseDto,
} from './dtos/presigned-url.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  async PresignedUrl(@Body() dto: PresignedUrlDto) {
    return ResponseDto.ok<PresignedUrlResponseDto>(
      await this.uploadService.PresignedUrl(
        dto.fileName,
        dto.contentType,
        dto.folder,
      ),
    );
  }
}
