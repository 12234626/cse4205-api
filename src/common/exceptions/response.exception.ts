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

  static unauthorized(message?: string): ResponseException {
    return new ResponseException(ErrorCode.UNAUTHORIZED, message);
  }

  static forbidden(message?: string): ResponseException {
    return new ResponseException(ErrorCode.FORBIDDEN, message);
  }

  static validationError(message?: string): ResponseException {
    return new ResponseException(ErrorCode.VALIDATION_ERROR, message);
  }

  static userNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_NOT_FOUND, message);
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

  static questNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.QUEST_NOT_FOUND, message);
  }

  static userQuestNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_QUEST_NOT_FOUND, message);
  }

  static rewardNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.REWARD_NOT_FOUND, message);
  }

  static userRewardNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.USER_REWARD_NOT_FOUND, message);
  }

  static invalidMentorRequest(message?: string): ResponseException {
    return new ResponseException(ErrorCode.INVALID_MENTOR_REQUEST, message);
  }

  static mentorRequestNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.MENTOR_REQUEST_NOT_FOUND, message);
  }

  static mentorRequestAlreadyExists(message?: string): ResponseException {
    return new ResponseException(
      ErrorCode.MENTOR_REQUEST_ALREADY_EXIST,
      message,
    );
  }

  static consentRequestAlreadyExists(message?: string): ResponseException {
    return new ResponseException(
      ErrorCode.CONSENT_REQUEST_ALREADY_EXISTS,
      message,
    );
  }

  static consentRequestNotFound(message?: string): ResponseException {
    return new ResponseException(ErrorCode.CONSENT_REQUEST_NOT_FOUND, message);
  }
}
