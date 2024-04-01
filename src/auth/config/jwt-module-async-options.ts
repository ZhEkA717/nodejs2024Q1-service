import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { env } from 'src/utils/constants';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get(env.JWT_SECRET_KEY, ''),
  signOptions: {
    expiresIn: config.get(env.TOKEN_EXPIRE_TIME, env.TOKEN_EXPIRE_TIME_DEFAULT),
  },
});

export const options = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
