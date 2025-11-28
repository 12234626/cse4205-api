import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';

class GeneratePresignedUrlDto {
  fileName: string;
  contentType: string;
  folder?: string; // 선택적: 기본값은 'images'
}

@Controller('upload')
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
