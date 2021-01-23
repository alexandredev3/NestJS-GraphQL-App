import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class UserType {
  @Field()
  id: string;

  @Field()
  name: string;
}
