import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { WalletNotFoundException } from '../exceptions/walletnotfound.exception';

@Catch(WalletNotFoundException)
export class WalletNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      error: message,
    });
  }
}