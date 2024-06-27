import { FastifyReply } from 'fastify';
import { AuthPasswordPayloadDto, AuthPayloadDto } from '@/auth/dto/auth.dto';

export type loginType = {
  payload: AuthPayloadDto;
  res: FastifyReply;
};
export type comparePasswordType = {
  password: string;
  userPassword: string;
};
export type logoutType = {
  userId: number;
  res: FastifyReply;
};
export type changePasswordType = AuthPasswordPayloadDto & {
  userId: number;
};
