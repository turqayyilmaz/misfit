const fs = require('fs');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Program = require('../models/Program');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.image = '/uploads/default-user-photo.png';
    await user.save();

    console.log('created user: ', {
      status: 'success',
      user: user,
    });
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
          console.log('loggedin user: ', {
            status: 'success',
            user: user,
          });
          req.session.userID = user._id;
          
          req.session.userName = user.name;
          req.session.role = user.role;
          res.status(200).redirect('/users/dashboard');
        } else {
          console.error('Invalid user credentials.');
          res.status(400).redirect('/login');
        }
      });
    } else {
      console.error('Invalid user credentials.');
      res.status(400).redirect('/login');
    }
  } catch (err) {
    console.log(err.message);
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
    console.log(err.message);
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

    if (req.files) {
      uploadPath += req.files.image.name;
      imagePath = '/uploads/' + req.files.image.name;
    }

    const user = await User.findById(req.params.id);

    if (req.files) {
      user.image = imagePath;
      await req.files.image.mv(uploadPath);
    }

    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'failed',
    });
  }
};
