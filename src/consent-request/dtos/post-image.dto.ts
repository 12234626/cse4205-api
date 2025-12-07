import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ConsentRequestImageEntity } from 'src/consent-request/entities/consent-request-image.entity';

export class PostImageDto {
  @ApiProperty({ description: '퀘스트 승인 요청 이미지 ID' })
  consentRequestImageId: number;

  @ApiProperty({ description: '이미지 URL' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiPropertyOptional({ description: '삭제일' })
  deletedAt: Date | null;

  constructor(consentRequestImage: ConsentRequestImageEntity) {
    this.consentRequestImageId = consentRequestImage.consentRequestImageId;
    this.imageUrl = consentRequestImage.imageUrl;
    this.createdAt = consentRequestImage.createdAt;
    this.deletedAt = consentRequestImage.deletedAt;
  }
}
