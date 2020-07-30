const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar DateTime

  type Image {
    url: String
    public_id: String
  }
  type User {
    _id: ID!
    username: String
    name: String
    email: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }
  type CreateUserResponse {
    username: String!
    email: String!
  }
  input ImageInput {
    url: String
    public_id: String
  }
  input UpdateUserInput {
    username: String
    email: String
    name: String
    images: [ImageInput]
    about: String
  }
  type Query {
    profile: User!
    publicProfile(username: String!): User!
    allUsers: [User!]
  }
  type Mutation {
    createUser: CreateUserResponse!
    updateUser(input: UpdateUserInput): User!
  }
`;
