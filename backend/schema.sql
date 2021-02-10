# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Like {
  id: String!
  post_id: String!
  user_id: String!
  user: User!
  created_at: DateTime!
  updated_at: DateTime!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type Post {
  id: String!
  title: String!
  description: String!
  likes_count: Float!
  comments_count: Float!
  user: User!
  likes: [Like!]!
  comments: [Comment!]!
  author_id: String!
  created_at: DateTime!
  updated_at: DateTime!
}

type Comment {
  id: String!
  post_id: String!
  user_id: String!
  content: String!
  user: User!
  created_at: DateTime!
  updated_at: DateTime!
}

type User {
  id: String!
  name: String!
  email: String!
  posts: [Post!]!
  created_at: DateTime!
  updated_at: DateTime!
}

type UserType {
  id: String!
  name: String!
}

type Session {
  user: UserType!
  token: String!
}

type CreateLikeType {
  message: String!
}

type DeleteLikeType {
  message: String!
}

type Query {
  getUsers: [User!]!
  getUnique(user_id: String!): User!
  getPosts: [Post!]!
  getUsersLiked(post_id: String!): [Like!]!
  getComments(post_id: String!): [Comment!]!
}

type Mutation {
  createUser(password: String!, email: String!, name: String!): User!
  session(password: String!, email: String!): Session!
  createPost(description: String!, title: String!): Post!
  createLike(post_id: String!): CreateLikeType!
  deleteLike(post_id: String!): DeleteLikeType!
  createComment(content: String!, post_id: String!): Comment!
}
