import { IsOptional, IsString } from 'class-validator';

export class PresignedUrlDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsString()
  folder?: string;
}

export class PresignedUrlResponseDto {
  @IsString()
  uploadUrl: string;

  @IsString()
  fileUrl: string;
}
