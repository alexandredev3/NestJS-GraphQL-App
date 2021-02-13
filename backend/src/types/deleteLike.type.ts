import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class DeleteLikeType {
  @Field()
  status: string;
}
