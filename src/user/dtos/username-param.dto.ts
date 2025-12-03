import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UsernameParamDto {
  @ApiProperty({ description: '사용자 닉네임', maxLength: 15 })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  username: string;
}
