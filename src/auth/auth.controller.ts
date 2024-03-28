import {
  BadRequestException,
  Body,
  Controller,
  // Get,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    console.log('asdasd');
    const user = await this.authService.signup(dto);
    if (!user)
      throw new BadRequestException(
        `Не получается зарегистрировать пользователя с ${JSON.stringify(dto)}`,
      );

    return user;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const tokens = await this.authService.login(dto);
    if (!tokens)
      throw new BadRequestException(
        `Не получается войти с ${JSON.stringify(dto)}`,
      );
  }

  // @Get('refresh')
  // refreshTokens() {}
}
