import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateConsentReviewDto {
  @ApiPropertyOptional({ description: '댓글' })
  @IsString()
  @IsOptional()
  comment?: string;
}
