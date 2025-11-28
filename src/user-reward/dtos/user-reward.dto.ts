import { IsInt } from 'class-validator';

export class CreateUserRewardDto {
  @IsInt()
  userId: number;

  @IsInt()
  rewardId: number;
}

export class UpdateUserRewardDto {
  // UserReward는 수정할 필드가 없음 (생성과 삭제만 존재)
}
