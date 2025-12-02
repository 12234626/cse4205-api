import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMentorRequestDto {
  @ApiProperty({ description: '멘토 ID' })
  @IsInt()
  mentorId: number;
}
