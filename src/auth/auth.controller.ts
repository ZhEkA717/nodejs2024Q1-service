import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, SignUpDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { UserAgent } from './decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    const user = await this.authService.signup(dto);
    if (!user)
      throw new BadRequestException(
        `Не получается зарегистрировать пользователя с ${JSON.stringify(dto)}`,
      );
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @UserAgent() agent: string) {
    const tokens = await this.authService.login(dto, agent);
    if (!tokens)
      throw new BadRequestException(
        `Не получается войти с ${JSON.stringify(dto)}`,
      );
    return { ...tokens, refreshToken: tokens.refreshToken.token };
  }

  @Post('refresh')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @UserAgent() agent: string,
  ) {
    const { refreshToken } = refreshTokenDto;
    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) throw new UnauthorizedException();
    return { ...tokens, refreshToken: tokens.refreshToken.token };
  }

  @Get('token')
  getAllTokens() {
    return this.authService.getAllToken();
  }
}
