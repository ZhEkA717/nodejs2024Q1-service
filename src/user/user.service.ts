import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from './exceptions/uuid.exception';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private convertResponse(user: UserModel | User): Omit<User, 'password'> {
    delete user.password;
    const { createdAt, updatedAt, ...response } = user;
    return {
      ...response,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (!this.validateCreateUserDto(createUserDto))
      throw new BadRequestException();
    const id = v4();
    const { login, password } = createUserDto;
    const version = 1;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const user = { id, login, password, version, createdAt, updatedAt };
    await this.prisma.user.create({ data: user });
    return this.convertResponse(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.convertResponse);
  }

  async findOne(userId: string): Promise<Omit<User, 'password'>> {
    if (!validate(userId)) throw new UUIDException();
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException();
    return this.convertResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    if (!validate(id)) throw new UUIDException();
    if (!this.validateUpdateUserDto(updateUserDto))
      throw new BadRequestException();
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    const isEqual = oldPassword === user.password;
    if (!isEqual) throw new ForbiddenException();
    const data = {
      password: newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.convertResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) throw new UUIDException();
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException();
    await this.prisma.user.delete({
      where: { id },
    });
  }

  validateCreateUserDto(createUserDto: CreateUserDto): boolean {
    const { login, password } = createUserDto;
    const isPasswordString = typeof password === 'string';
    const isloginString = typeof login === 'string';
    return login && password && isPasswordString && isloginString;
  }

  validateUpdateUserDto(updateUserDto: UpdateUserDto): boolean {
    const { oldPassword, newPassword } = updateUserDto;
    const isOldPasswordString = typeof oldPassword === 'string';
    const isNewPasswordString = typeof newPassword === 'string';
    return (
      oldPassword && newPassword && isOldPasswordString && isNewPasswordString
    );
  }
}
