const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    _id: ID!
    content: String!
    image: Image
    postedBy: User
    description: String!
  }

  input CreatePostInput {
    content: String!
    image: ImageInput
  }

  type Query {
    allPosts: [Post!]!
    userPosts: [Post!]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
  }
`;
