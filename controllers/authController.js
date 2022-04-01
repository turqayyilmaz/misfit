const fs = require('fs');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Program = require('../models/Program');
const utils = require('../controllers/utils');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.image = '/uploads/default-user-photo.png';
    await user.save();

    res.status(201).redirect('/login');
  } catch (err) {
    const errors = validationResult(req);
    const errorMessage = [];
    errorMessage.push(err.message);
    for (let i = 0; i < errors.array().length; i++) {
      errorMessage.push(errors.array()[i].msg);
    }

    res.status(400).json({
      status: 'failed',
      user: JSON.stringify(errorMessage),
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          req.session.userID = user._id;
          req.session.userName = user.name;
          req.session.role = user.role;
          res.status(200).redirect('/users/dashboard');
        } else {
          res.status(400).redirect('/login');
        }
      });
    } else {
      res.status(400).redirect('/login');
    }
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err.message,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const program = await Program.deleteMany({ trainerID: req.params.id });

    res.status(200).redirect('/users/dashboard');
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err.message,
    });
  }
};

exports.getDashboardPage = async (req, res) => {
  res.locals.pageName = 'dashboard';
  res.locals.pageTitle = 'Dashboard';
  try {
    const user = await User.findOne({ _id: req.session.userID }).populate(
      'enrolledPrograms'
    );
    const programs = await Program.find({ trainerID: req.session.userID }).sort(
      '-dateCreated'
    );
    const users = await User.find().sort('-dateCreated');
    const categories = await Category.find();

    res.status(200).render('dashboard', {
      user: user,
      programs: programs,
      categories: categories,
      users: users,
    });
  } catch (err) {
    res.status(400).json({
      pageName: 'dashboard',
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.phone = req.body.phone;

    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err.message,
    });
  }
};

exports.addProfilePhoto = async (req, res) => {
  try {
    const uploadDir = 'public/uploads';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let uploadPath = __dirname + '/../public/uploads/';
    let imagePath = '';

    //console.log('files:', req.files.photoInput);
    profileImage = req.files.photoInput;
    if (profileImage) {
      uploadPath += profileImage.name;
      imagePath = '/uploads/' + profileImage.name;
      const user = await User.findById(req.params.id);
      user.image = imagePath;
      await profileImage.mv(uploadPath);
      await user.save();
      res.status(200).redirect('/users/dashboard');
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'failed',
    });
  }
};
