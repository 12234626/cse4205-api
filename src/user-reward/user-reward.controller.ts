import { Controller } from '@nestjs/common';
import { UserRewardService } from './user-reward.service';

@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}
}
