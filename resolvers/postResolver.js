const { gql } = require("apollo-server-express");
const { DateTimeResolver } = require("graphql-scalars");
const { authCheck } = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

// Query
const allPosts = async (_, args) => {
  return await Post.find({})
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 })
    .exec();
};

const singlePost = async (_, args) => {
  return await Post.findById({ _id: args.postId })
    .populate("postedBy", "_id username")
    .exec();
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

const updatePost = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  // Validation
  if (args.input.content.trim() === "") throw new Error("Content is required!");
  const postCreator = await User.findOne({ email: currentUser.email }).exec();
  const postToUpdate = await Post.findById({ _id: args.input._id }).exec();
  if (postCreator._id.toString() !== postToUpdate.postedBy._id.toString())
    throw new Error("Unauthorized action.");
  let updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true }
  )
    .exec()
    .then((p) => p.populate("postedBy", "_id username").execPopulate());

  return updatedPost;
};

const deletePost = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  const postCreator = await User.findOne({ email: currentUser.email }).exec();
  const postToDelete = await Post.findById({ _id: args.postId }).exec();
  if (postCreator._id.toString() !== postToDelete.postedBy._id.toString())
    throw new Error("Unauthorized action.");
  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();

  return deletedPost;
};

module.exports = {
  Query: { allPosts, userPosts, singlePost },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
};
