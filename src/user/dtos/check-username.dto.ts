import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CheckUsernameResponseDto {
  @ApiProperty({ description: '사용자 이름 존재 여부' })
  @IsBoolean()
  exists: boolean;
}
