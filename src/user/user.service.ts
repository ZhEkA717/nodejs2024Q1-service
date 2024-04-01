import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, genSaltSync, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
    const id = v4();
    const { login, password } = createUserDto;
    const version = 1;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const passwordHashed = await this.hashPassword(password);
    const user = {
      id,
      login,
      password: passwordHashed,
      version,
      createdAt,
      updatedAt,
    };
    await this.prisma.user.create({ data: user });
    return this.convertResponse(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    throw new Error('asdas');
    const users = await this.prisma.user.findMany();
    return users.map(this.convertResponse);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return this.convertResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    const isEqual = await compare(oldPassword, user.password);
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
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException();
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    const salt: number = +this.configService.get('CRYPT_SALT', 10);
    return hash(password, genSaltSync(salt));
  }
}
