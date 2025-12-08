import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRewardDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '보상 ID' })
  @IsInt()
  rewardId: number;
}
