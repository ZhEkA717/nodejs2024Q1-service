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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(dto: SignUpDto) {
    return await this.userService.create(dto);
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user: User = await this.prisma.user.findFirst({
      where: { login: dto.login },
    });
    if (!user) throw new UnauthorizedException('Не верный логин или пароль');

    const isEqual = await this.comparePasswords(dto.password, user.password);

    if (!isEqual) throw new UnauthorizedException('Не верный логин или пароль');

    const { id, login } = user;
    const accessToken = this.jwtService.sign({ id, login });
    const refreshToken = await this.getRefreshToken({ id, login });
    return { accessToken, refreshToken };
  }

  async getRefreshToken({ id: userId, login }: Partial<User>): Promise<Token> {
    const exp = +process.env.TOKEN_EXPIRE_TIME || 1;
    return this.prisma.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { hours: exp }),
        userId,
        login,
      },
    });
  }

  async comparePasswords(
    dtoPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await compare(dtoPassword, userPassword);
  }
}
