import { Request, Response } from 'express';

import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const request: Request = ctx.req;
    const response: Response = ctx.req.res;
    const status = exception.getStatus();
    const { message } = exception;
    const { headers } = request;

    return response.status(status).set(headers).json({
      code: status,
      message,
      timestamps: new Date().toISOString(),
    });
  }
}
