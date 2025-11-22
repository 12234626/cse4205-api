import { Controller } from '@nestjs/common';
import { UserQuestService } from './user-quest.service';

@Controller('user-quest')
export class UserQuestController {
  constructor(private readonly userQuestService: UserQuestService) {}
}
