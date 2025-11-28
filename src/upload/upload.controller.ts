import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { UploadService } from 'src/upload/upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

class GeneratePresignedUrlDto {
  fileName: string;
  contentType: string;
  folder?: string; // 선택적: 기본값은 'images'
}

@Controller('upload')
@UseGuards(JwtAuthGuard) // ← 인증된 사용자만 접근 가능
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  async generatePresignedUrl(@Body() dto: GeneratePresignedUrlDto) {
    return this.uploadService.generatePresignedUrl(
      dto.fileName,
      dto.contentType,
      dto.folder,
    );
  }
}
