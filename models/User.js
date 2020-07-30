const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      index: true,
      unique: true
    },
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    images: {
      type: Array,
      default: [
        {
          url: 'https://via.placeholder.com/200x200?text=Profile',
          public_id: Date.now
        }
      ]
    },
    about: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
