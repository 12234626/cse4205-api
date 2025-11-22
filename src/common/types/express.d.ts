import { UserEntity } from 'src/user/entities/user.entity';
import { Payload } from 'src/auth/types/payload.type';

declare global {
  namespace Express {
    interface User extends UserEntity {}
    export interface Request {
      payload: Payload;
    }
  }
}
