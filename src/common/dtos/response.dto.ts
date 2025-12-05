import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  readonly statusCode: number;
  readonly success: boolean = true;
  readonly data?: T;
  readonly message?: string;

  constructor(statusCode: number, data?: T, message?: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static ok<T>(data: T, message?: string): ResponseDto<T> {
    return new ResponseDto<T>(HttpStatus.OK, data, message);
  }

  static created<T>(data: T, message?: string): ResponseDto<T> {
    return new ResponseDto<T>(HttpStatus.CREATED, data, message);
  }

  static accepted<T>(data: T, message?: string): ResponseDto<T> {
    return new ResponseDto<T>(HttpStatus.ACCEPTED, data, message);
  }

  static noContent(): ResponseDto<null> {
    return new ResponseDto(HttpStatus.NO_CONTENT);
  }
}
