import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsEnum, IsDate } from 'class-validator';

import { MentorRequestEntity } from 'src/user/entities/mentor-request.entity';
import { RequestStatus } from 'src/user/types/request-status.type';
import { UserDto } from './user.dto';

export class MentorRequestDto {
  @ApiProperty({ description: '멘토 요청 ID' })
  @IsInt()
  mentorRequestId: number;

  @ApiProperty({ description: '멘티', type: () => UserDto })
  mentee: UserDto;

  @ApiProperty({ description: '멘토', type: () => UserDto })
  mentor: UserDto;

  @ApiProperty({ enum: RequestStatus, description: '요청 상태' })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty({ description: '생성일 (유닉스 시간)' })
  createdAt: number;

  @ApiProperty({ description: '수정일 (유닉스 시간)' })
  updatedAt: number;

  constructor(mentorRequest: MentorRequestEntity) {
    this.mentorRequestId = mentorRequest.mentorRequestId;
    this.mentee = new UserDto(mentorRequest.mentee);
    this.mentor = new UserDto(mentorRequest.mentor);
    this.status = mentorRequest.status;
    this.createdAt = mentorRequest.createdAt.getTime();
    this.updatedAt = mentorRequest.updatedAt.getTime();
  }
}
