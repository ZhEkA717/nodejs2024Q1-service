import { Token } from '@prisma/client';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}

export interface JwtPayload {
  userId: string;
  login: string;
}
