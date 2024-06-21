import { AuthPayloadDto } from '@/auth/dto/auth.dto';
import { FastifyReply } from 'fastify';

export type getTokensType = Omit<AuthPayloadDto, 'password'> & {
  userId: number;
};
export type createTokensType = {
  userId: number;
  at: string;
  rt: string;
};
export type updateTokensType = {
  userId: number;
  at: string;
  rt: string;
};
export type cookiesCreateType = {
  res: FastifyReply;
  at: string;
  rt: string;
};
export type jwtTokenType = {
  id: string;
  email: string;
  username: string;
};
