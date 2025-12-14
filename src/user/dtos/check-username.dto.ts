import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.type';

export class CheckUsernameDto {
  @ApiProperty({
    description: '닉네임 사용 가능 여부',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: '사용자 역할 (닉네임이 존재하는 경우)',
    enum: UserRole,
    example: UserRole.MENTOR,
    nullable: true,
  })
  role: UserRole | null;

  constructor(available: boolean, role?: UserRole) {
    this.available = available;
    this.role = role || null;
  }
}
