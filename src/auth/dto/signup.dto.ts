import { IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;
}
