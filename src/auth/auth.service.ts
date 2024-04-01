import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { UserService } from 'src/user/user.service';
import { Tokens } from './interfaces/interfaces';
import { compare } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from 'src/Error';
import { env } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prisma.token
      .findUnique({
        where: { token: refreshToken },
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (!token) throw new ForbiddenException(ErrorMessages.TOKEN_NOT_FOUND);

    await this.prisma.token.delete({ where: { token: refreshToken } });
    try {
      await this.jwtService.verifyAsync(token.token);
    } catch (err) {
      throw new ForbiddenException(ErrorMessages.TOKEN_NOT_FOUND);
    }
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
    if (!user) throw new ForbiddenException(ErrorMessages.WRONG_DATA);

    const isEqual = await this.comparePasswords(dto.password, user.password);

    if (!isEqual) throw new ForbiddenException(ErrorMessages.WRONG_DATA);

    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken = this.jwtService.sign({
      userId: user.id,
      login: user.login,
    });
    const refreshToken = await this.getRefreshToken(user, agent);
    return { accessToken, refreshToken };
  }

  async getRefreshToken(
    { id: userId, login }: User,
    _agent: string,
  ): Promise<Token> {
    const agent = _agent || env.AGENT_DEFAULT;
    const _token = await this.prisma.token.findFirst({
      where: { userId, userAgent: agent },
    });
    const token = _token?.token ?? '';
    const expiresIn: string = this.configService.get(
      env.TOKEN_REFRESH_EXPIRE_TIME,
      env.TOKEN_REFRESH_EXPIRE_TIME_DEFAULT,
    );
    const secret: string = this.configService.get(env.JWT_SECRET_REFRESH_KEY);
    return this.prisma.token.upsert({
      where: { token },
      update: {
        token: this.jwtService.sign({ userId, login }, { expiresIn, secret }),
      },
      create: {
        token: this.jwtService.sign({ userId, login }, { expiresIn, secret }),
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
