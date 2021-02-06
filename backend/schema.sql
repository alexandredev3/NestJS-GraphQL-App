# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Post {
  id: String!
  title: String!
  description: String!
  author_id: String!
  created_at: DateTime!
  updated_at: DateTime!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type User {
  id: String!
  name: String!
  email: String!
  password: String!
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

type Query {
  getUsers: [User!]!
  getPosts: [Post!]!
}

type Mutation {
  createUser(password: String!, email: String!, name: String!): User!
  session(password: String!, email: String!): Session!
  createPost(description: String!, title: String!): Post!
}
