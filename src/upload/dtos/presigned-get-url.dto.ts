import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class PresignedGetUrlRequestDto {
  @ApiProperty({
    description: '파일 URL',
    example:
      'https://bucket.s3.region.amazonaws.com/images/2024-01-01/123-image.jpg',
  })
  @IsUrl()
  fileUrl: string;
}

export class PresignedGetUrlResponseDto {
  @ApiProperty({
    description: 'Presigned GET URL (1시간 유효)',
    example:
      'https://bucket.s3.region.amazonaws.com/images/2024-01-01/123-image.jpg?AWSAccessKeyId=...&Expires=...',
  })
  @IsString()
  url: string;
}
