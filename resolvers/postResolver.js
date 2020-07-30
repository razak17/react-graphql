const { gql } = require("apollo-server-express");
const { DateTimeResolver } = require("graphql-scalars");
const { authCheck } = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

// Query
const allPosts = async (_, args) => {
  return await Post.find({}).populate("postedBy", "_id username").exec();
};

const userPosts = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  const postCreator = await User.findOne({
    email: currentUser.email,
  }).exec();

  return await Post.find({ postedBy: postCreator })
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 });
};

// Mutation
const createPost = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  // Validation
  if (args.input.content.trim() === "") throw new Error("Content is Empty!");
  const postCreator = await User.findOne({ email: currentUser.email });
  let newPost = await new Post({
    ...args.input,
    postedBy: postCreator._id,
  })
    .save()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());
  return newPost;
};

module.exports = {
  Query: { allPosts, userPosts },
  Mutation: {
    createPost,
  },
};
