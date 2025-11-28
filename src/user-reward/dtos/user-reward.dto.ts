import { IsInt } from 'class-validator';

export class CreateUserRewardDto {
  @IsInt()
  userId: number;

  @IsInt()
  rewardId: number;
}
