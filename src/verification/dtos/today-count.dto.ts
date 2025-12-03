import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class TodayReviewCountDto {
  @ApiProperty({ description: '오늘 리뷰한 인증글 개수', example: 5 })
  @IsInt()
  @Min(0)
  count: number;
}
