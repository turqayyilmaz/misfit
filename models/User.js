const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role:{
      type: String,
      enum:["member", "trainer", "admin"],
      default: "member"
    }
  },
  { timestamps: {} }
);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
