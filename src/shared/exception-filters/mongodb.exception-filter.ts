import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';
import { ErrorType } from '../enums';

const EXEPTION_CODE_MAP = {
  11000: (exception: MongoError, host: ArgumentsHost): void => {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      error: {
        type: ErrorType.Duplication,
        keyValue: (exception as any).keyValue,
      },
    });
  },
};

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    return EXEPTION_CODE_MAP[exception.code](exception, host);
  }
}
