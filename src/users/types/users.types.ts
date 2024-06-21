import { UsersPayloadDto } from '@/users/dto/users.dto';
import { AuthPayloadDto } from '@/auth/dto/auth.dto';

export type UsersUpdateUserId = {
  userId: number;
  payload: UsersPayloadDto;
};
export type UsersFindUserType = Partial<AuthPayloadDto> & {
  userId?: number;
};
export type UsersUpdatePasswordType = {
  userId: number;
  password: string;
};
