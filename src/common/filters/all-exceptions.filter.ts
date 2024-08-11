import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { t } from 'i18next';
import { ErrorCode } from '../enums';
import { Response, ValidationError } from '../models';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();

    if (
      exception instanceof HttpException &&
      !(exception instanceof InternalServerErrorException)
    ) {
      const response = exception.getResponse() as HttpExceptionBody;
      res.status(exception.getStatus()).json(
        (Array.isArray(response.message)
          ? {
              error: {
                code: ErrorCode.INVALID_INPUT,
                message: t(ErrorCode.INVALID_INPUT),
                details: this.transformErrorMessages(response.message),
              },
            }
          : {
              error: {
                code: response.message,
                message: t(response.message),
                details: [],
              },
            }) as Response,
      );
      return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      (typeof exception.getResponse === 'function'
        ? { error: exception.getResponse() }
        : {
            error: {
              code: ErrorCode.INTERNAL_SERVER_ERROR,
              ...exception,
              message: exception.toString(),
            },
          }) as Response,
    );
  }

  private transformErrorMessages(messages: string[]): ValidationError[] {
    return messages.map((message) => {
      message = message.replace(/(\.)(\d+)/g, '[$2]');
      if (message.includes('each value in')) {
        message = message.replace(/each value in (nested property )?/, '');
        return {
          field: message.split(' ')[0],
          message: `each value in ${message}`,
        };
      }
      return { field: message.split(' ')[0], message };
    });
  }
}
