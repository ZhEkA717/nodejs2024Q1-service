import { Token } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  login: string;
}
