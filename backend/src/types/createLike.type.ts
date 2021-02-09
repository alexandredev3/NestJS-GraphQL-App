import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class CreateLikeType {
  @Field()
  message: string;
}
