import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface IPayload {
  user: {
    id: string;
  };
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req.user;
  }
);
