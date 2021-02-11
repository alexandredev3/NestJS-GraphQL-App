import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class CreateLikeType {
  @Field()
  id: string;

  @Field()
  message: string;
}
