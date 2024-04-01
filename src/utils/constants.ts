export const FAVORITE_ID = 1;

export enum env {
  PORT = 'PORT',
  CRYPT_SALT = 'CRYPT_SALT',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  JWT_SECRET_REFRESH_KEY = 'JWT_SECRET_REFRESH_KEY',
  TOKEN_EXPIRE_TIME = 'TOKEN_EXPIRE_TIME',
  TOKEN_EXPIRE_TIME_DEFAULT = '1h',
  TOKEN_REFRESH_EXPIRE_TIME = 'TOKEN_REFRESH_EXPIRE_TIME',
  TOKEN_REFRESH_EXPIRE_TIME_DEFAULT = '24h',
  AGENT_DEFAULT = 'NO_NAME',
  MAX_SIZE_FILE = 'MAX_SIZE_FILE',
}

export const PUBLIC_KEY = 'public';

export enum pathLogs {
  PATH = 'Logs',
  RESPONSE = 'Responce',
  REQUEST = 'Request',
}

export type TypeLogs = 'responce.log.txt' | 'request.log.txt' | 'error.log.txt';
