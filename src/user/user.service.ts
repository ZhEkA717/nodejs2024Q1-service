import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from './exceptions/uuid.exception';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto):User {
    if (!this.validateCreateUserDto(createUserDto)) throw new BadRequestException();
    const id = v4();
    const version = 1;
    const createdAt = new Date().getTime();
    const updatedAt = createdAt;
    const user = { id, ...createUserDto, version, createdAt, updatedAt };
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string): User {
    if (!validate(id)) throw new UUIDException();
    const user = this.searchUser(id)
    if (!user) throw new NotFoundException();
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto):void {
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
      version: user.version + 1
    }
    const index: number = this.users.indexOf(user);
    this.users[index] = newUser;
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
