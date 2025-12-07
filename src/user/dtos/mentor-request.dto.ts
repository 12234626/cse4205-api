import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMentorRequestDto {
  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  otherUsername: string;
}
