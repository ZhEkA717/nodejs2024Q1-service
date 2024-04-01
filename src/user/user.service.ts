import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, genSaltSync, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { ErrorMessages } from 'src/Error';

@Injectable()
export class UserService {
  private db = this.prisma.user;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private convertResponse(user: UserModel): Omit<User, 'password'> {
    delete user.password;
    const { createdAt, updatedAt, ...response } = user;
    return {
      ...response,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { login, password } = createUserDto;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const passwordHashed = await this.hashPassword(password);
    const user = await this.db.create({
      data: {
        login,
        password: passwordHashed,
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
      },
    });
    return this.convertResponse(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.db.findMany();
    return users.map(this.convertResponse);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.db.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    return this.convertResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.db.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    const isEqual = await compare(oldPassword, user.password);
    if (!isEqual) throw new ForbiddenException(ErrorMessages.WRONG_DATA);

    const updatedUser = await this.db.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
        updatedAt: new Date().getTime(),
      },
    });

    return this.convertResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.db.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    await this.db.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    const salt: number = +this.configService.get('CRYPT_SALT', 10);
    return hash(password, genSaltSync(salt));
  }
}
