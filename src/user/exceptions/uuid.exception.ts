import { HttpException, HttpStatus } from '@nestjs/common';

export class UUIDException extends HttpException {
  constructor() {
    super('not uuid', HttpStatus.BAD_REQUEST);
  }
}
