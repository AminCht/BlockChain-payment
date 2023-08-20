import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { TransactionNotFoundException } from '../exceptions/transactionNotFound';

@Catch(TransactionNotFoundException)
export class TransactionNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      message: message,
      statusCode: status,
    });
  }
}