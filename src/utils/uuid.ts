import { Param, ParseUUIDPipe } from '@nestjs/common';

export function UUIDParam(name: string) {
  const version = '4';
  return Param(name, new ParseUUIDPipe({ version }));
}
