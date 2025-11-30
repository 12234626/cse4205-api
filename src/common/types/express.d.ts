import { UserEntity } from 'src/user/entities/user.entity';
import { Payload } from 'src/auth/types/token.type';

declare global {
  namespace Express {
    export interface Request {
      token: string;
      payload: Payload;
      user: UserEntity;
    }
  }
}
