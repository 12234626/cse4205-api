import { SetMetadata } from '@nestjs/common';

import { UserRole } from 'src/user/types/user-role.type';

export const USER_ROLES_KEY = 'roles';

export const UserRoles = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
