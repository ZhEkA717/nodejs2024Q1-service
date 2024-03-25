import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from './exceptions/uuid.exception';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto):Omit<User, 'password'> {
    if (!this.validateCreateUserDto(createUserDto)) throw new BadRequestException();
    const id = v4();
    const {login, password} = createUserDto;
    const version = 1;
    const createdAt = new Date().getTime();
    const updatedAt = createdAt;
    const user = { id, login, password, version, createdAt, updatedAt };
    this.users.push(user);
    return { id, login, version, createdAt, updatedAt };
  }

  findAll() {
    return this.users.map(({id, login, version, createdAt, updatedAt}) => ({
      id, login, version, createdAt, updatedAt
    }));
  }

  findOne(userId: string): Omit<User, 'password'> {
    if (!validate(userId)) throw new UUIDException();
    const user = this.searchUser(userId)
    if (!user) throw new NotFoundException();
    const { id, login, version, createdAt, updatedAt } = user;
    return { id, login, version, createdAt, updatedAt };
  }

  update(id: string, updateUserDto: UpdateUserDto):Omit<User, 'password'> {
    if (!validate(id)) throw new UUIDException();
    if (!this.validateUpdateUserDto(updateUserDto)) throw new BadRequestException();
    const {oldPassword, newPassword } = updateUserDto;
    const user = this.searchUser(id);
    if (!user) throw new NotFoundException();
    const isEqual = oldPassword === user.password;
    if (!isEqual) throw new ForbiddenException();
    const newUser = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime()
    }
    const { id: idUser, login, version, createdAt, updatedAt } = newUser;
    const index: number = this.users.indexOf(user);
    this.users[index] = newUser;
    return { id: idUser, login, version, createdAt, updatedAt };
  }

  remove(id: string): void {
    if (!validate(id)) throw new UUIDException();
    const user = this.searchUser(id);
    if (!user) throw new NotFoundException(); 
    const index: number = this.users.indexOf(user);
    this.users.splice(index, 1);
  }

  searchUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  validateCreateUserDto(createUserDto: CreateUserDto): boolean {
    const {login, password} = createUserDto;
    const isPasswordString = typeof password === 'string';
    const isloginString = typeof login === 'string';
    return login && password && isPasswordString && isloginString;
  }

  validateUpdateUserDto(updateUserDto: UpdateUserDto): boolean {
    const {oldPassword, newPassword} = updateUserDto;
    const isOldPasswordString = typeof oldPassword === 'string';
    const isNewPasswordString = typeof newPassword === 'string';
    return oldPassword && newPassword && isOldPasswordString && isNewPasswordString;
  }
}
