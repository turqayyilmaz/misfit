const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../models/User');

exports.getIndexPage = (req, res) => {
  res.locals.pageName = 'index';
  res.locals.pageTitle = 'MisFit;';
  res.render('index');
};

exports.getAboutPage = (req, res) => {
  res.locals.pageName = 'about';
  res.locals.pageTitle = 'About MisFit';
  res.render('about');
};

exports.getServicesPage = (req, res) => {
  res.locals.pageName = 'services';
  res.locals.pageTitle = 'OUR SERVICES';
  res.render('services');
};

exports.getNewsPage = (req, res) => {
  res.locals.pageName = 'news';
  res.locals.pageTitle = 'Latest News';
  res.render('news');
};

exports.getTrainersPage = (req, res) => {
  res.locals.pageName = 'trainers';
  res.locals.pageTitle = 'Our Trainers';
  res.render('trainers');
};

exports.getGalleryPage = (req, res) => {
  res.locals.pageName = 'gallery';
  res.locals.pageTitle = 'Gallery';
  res.render('gallery');
};

exports.getContactPage = (req, res) => {
  res.locals.pageName = 'contact';
  res.locals.pageTitle = 'Request a Call For You';
  res.render('contact');
};

exports.getLoginPage = (req, res) => {
  res.locals.pageName = 'login';
  res.locals.pageTitle = 'Login';
  res.render('login');
};

exports.checkLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          if (same) {
            // USER SESSION
            req.session.userID = user._id;
            req.session.userName = user.name;
            req.session.role = user.role;
            res.redirect('/');
          } else {
            req.flash('error', 'Your password is not correct!');
            res.status(400).redirect('/login');
          }
        });
      } else {
        req.flash('error', 'User is not exist!');
        res.status(400).redirect('/login');
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getRegisterPage = (req, res) => {
  res.locals.pageName = 'register';
  res.locals.pageTitle = 'Register';
  res.render('register');
};

exports.saveUser = async (req, res) => {
  try {
    const user = { ...req.body };
    await User.create(user);
    res.redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    console.log(error);
    //console.log(errors.array()[0].msg);
   

    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }

    req.flash("error",error.message);

    res.status(400).redirect('/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
