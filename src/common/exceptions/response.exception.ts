import { HttpException } from '@nestjs/common';

import { ErrorCode, ErrorHttpStatus } from 'src/common/types/error-code.type';

export class ResponseException extends HttpException {
  constructor(errorCode: ErrorCode, message?: string) {
    const status = ErrorHttpStatus[errorCode];

    super(
      {
        statusCode: status,
        success: false,
        error: errorCode,
        message,
      },
      status,
    );
  }

  static forbidden(message?: string): ResponseException {
    return new ResponseException(ErrorCode.FORBIDDEN, message);
  }

  static userNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_NOT_FOUND, message);
  }

  static userDeleted(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_DELETED, message);
  }

  static userAlreadyExists(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_ALREADY_EXISTS, message);
  }

  static invalidRole(message?: string): ResponseException {
    return new ResponseException(ErrorCode.INVALID_ROLE, message);
  }

  static invalidProvider(message?: string): ResponseException {
    return new ResponseException(ErrorCode.INVALID_PROVIDER, message);
  }

  static invalidToken(message?: string): ResponseException {
    return new ResponseException(ErrorCode.INVALID_TOKEN, message);
  }
}
