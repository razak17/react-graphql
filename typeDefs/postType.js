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

  input UpdatePostInput {
    _id: String!
    content: String!
    image: ImageInput
  }

  type Query {
    allPosts(page: Int): [Post!]!
    userPosts: [Post!]!
    singlePost(postId: String!): Post!
    totalPosts: Int!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(postId: String!): Post!
  }
`;
