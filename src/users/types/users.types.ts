import { UsersPayloadDto } from '@/users/dto/users.dto';
import { AuthPayloadDto } from '@/auth/dto/auth.dto';
import { User, Vendor } from '@prisma/client';

export type updateUserId = {
  userId: number;
  payload: UsersPayloadDto;
};
export type findUserType = Partial<AuthPayloadDto> & {
  userId?: number;
};
export type updatePasswordType = {
  userId: number;
  password: string;
};
export type getUserWithVendor = User & {
  vendor: Vendor;
};
