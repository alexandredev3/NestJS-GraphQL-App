import { Field, ObjectType } from '@nestjs/graphql';

import UserType from './user.type';

@ObjectType()
export default class Session {
  @Field()
  user: UserType;

  @Field()
  token: string;
}
