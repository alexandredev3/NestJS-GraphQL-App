# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type User {
  id: String!
  name: String!
  email: String!
  password: String!
  created_at: DateTime!
  updated_at: DateTime!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type Query {
  users: [User!]!
}

type Mutation {
  createUser(password: String!, email: String!, name: String!): User!
}
