import { ApiProperty } from '@nestjs/swagger';

export class AssignAllResponseDto {
  @ApiProperty({ description: '메시지', example: '일일 퀘스트 할당 완료' })
  message: string;

  @ApiProperty({ description: '성공한 사용자 수', example: 10 })
  successful: number;

  @ApiProperty({ description: '실패한 사용자 수', example: 0 })
  failed: number;

  @ApiProperty({ description: '전체 사용자 수', example: 10 })
  total: number;
}
