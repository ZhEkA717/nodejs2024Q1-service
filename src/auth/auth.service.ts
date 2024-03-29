import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { UserService } from 'src/user/user.service';
import { Tokens } from './interfaces/interfaces';
import { compare } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prisma.token.findUnique({
      where: { token: refreshToken },
    });

    if (!token) throw new UnauthorizedException();

    await this.prisma.token.delete({ where: { token: refreshToken } });

    if (new Date(token.exp) < new Date()) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: token.userId },
    });

    return this.generateTokens(user, agent);
  }

  async signup(dto: SignUpDto) {
    return await this.userService.create(dto);
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.prisma.user.findFirst({
      where: { login: dto.login },
    });
    if (!user) throw new UnauthorizedException('Не верный логин или пароль');

    const isEqual = await this.comparePasswords(dto.password, user.password);

    if (!isEqual) throw new UnauthorizedException('Не верный логин или пароль');

    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken =
      'Bearer ' + this.jwtService.sign({ id: user.id, login: user.login });
    const refreshToken = await this.getRefreshToken(user, agent);
    return { accessToken, refreshToken };
  }

  async getRefreshToken(
    { id: userId, login }: User,
    agent: string,
  ): Promise<Token> {
    const _token = await this.prisma.token.findFirst({
      where: { userId, userAgent: agent },
    });
    const token = _token?.token ?? '';
    const exp: number = this.configService.get('TOKEN_REFRESH_EXPIRE_TIME', 24);
    return this.prisma.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { hours: exp }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { hours: exp }),
        userId,
        login,
        userAgent: agent,
      },
    });
  }

  async getAllToken() {
    return this.prisma.token.findMany();
  }

  async comparePasswords(
    dtoPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await compare(dtoPassword, userPassword);
  }
}
