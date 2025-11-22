import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  FORBIDDEN,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS,
  USER_DELETED,
  INVALID_ROLE,
  INVALID_PROVIDER,
  INVALID_TOKEN,
}

export const ErrorHttpStatus: Record<ErrorCode, number> = {
  [ErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [ErrorCode.USER_DELETED]: HttpStatus.NOT_FOUND,
  [ErrorCode.INVALID_ROLE]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INVALID_PROVIDER]: HttpStatus.BAD_REQUEST,
  [ErrorCode.INVALID_TOKEN]: HttpStatus.BAD_REQUEST,
};
