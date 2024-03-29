import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, SignUpDto } from './dto';
import { Public, UserAgent } from './decorators';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    const user = await this.authService.signup(dto);
    if (!user)
      throw new BadRequestException(
        `Не получается зарегистрировать пользователя с ${JSON.stringify(dto)}`,
      );
    return { id: user.id };
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
  @HttpCode(200)
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @UserAgent() agent: string,
  ) {
    const { refreshToken } = refreshTokenDto;
    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) throw new UnauthorizedException();
    return { ...tokens, refreshToken: tokens.refreshToken.token };
  }

  @Public()
  @Get('token')
  getAllTokens() {
    return this.authService.getAllToken();
  }
}
