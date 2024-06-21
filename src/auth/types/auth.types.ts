import { FastifyReply } from 'fastify';
import { AuthPasswordPayloadDto, AuthPayloadDto } from '@/auth/dto/auth.dto';

export type AuthLoginType = {
  payload: AuthPayloadDto;
  res: FastifyReply;
};
export type AuthComparePasswordType = {
  password: string;
  userPassword: string;
};
export type AuthLogoutType = {
  userId: number;
  res: FastifyReply;
};
export type AuthRefreshTokenType = {
  userId: number;
  res: FastifyReply;
};
export type AuthChangePasswordType = AuthPasswordPayloadDto & {
  userId: number;
};
