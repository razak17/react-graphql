const { gql } = require("apollo-server-express");
const shortid = require("shortid");
const { DateTimeResolver } = require("graphql-scalars");
const { authCheck } = require("../middleware/auth");
const User = require("../models/User");

const profile = async (_, args, { req, res }) => {
  const currentUser = await authCheck(req);
  return await User.findOne({ email: currentUser.email }).exec();
};

const publicProfile = async (_, args, { req }) => {
  return await User.findOne({ username: args.username }).exec();
};

const allUsers = async (_, args) => await User.find({}).exec();

const createUser = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  const user = await User.findOne({ email: currentUser.email });
  return user
    ? user
    : new User({
        email: currentUser.email,
        username: shortid.generate(),
      }).save();
};

const updateUser = async (_, args, { req }) => {
  const currentUser = await authCheck(req);
  const updatedUser = await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec();
  return updatedUser;
};

module.exports = {
  Query: {
    profile,
    publicProfile,
    allUsers,
  },
  Mutation: {
    createUser,
    updateUser,
  },
};
