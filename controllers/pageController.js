const User = require('../models/User');

exports.getIndexPage = (req, res) => {
  res.locals.pageName = 'index';
  res.locals.pageTitle = 'MisFit;';
  res.render('index');
};
exports.getAboutPage = (req, res) => {
    res.locals.pageName = 'about';
    res.locals.pageTitle = 'About';
  res.render('about');
};
exports.getTrainerPage = async (req, res) => {
    res.locals.pageName = 'trainers';
    res.locals.pageTitle = 'Our Trainers';
  try {
    const trainers = await User.find({ role: 'trainer' });

    res.render('trainers');
    //, {trainers: trainers,}
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err.message,
    });
  }
};

exports.getTrainerSinglePage = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);
    res.render('trainer', {
      pageName: 'trainer',
      trainer: trainer,
    });
  } catch (err) {
    res.status(400),
      json({
        status: 'failed',
        error: err.message,
      });
  }
};

exports.getLoginPage = (req, res) => {
    res.locals.pageName = 'login';
    res.locals.pageTitle = 'Login';
  res.render('login');
};
exports.getRegisterPage = (req, res) => {
  res.locals.pageName = 'login';
  res.locals.pageTitle = 'Register';
  res.render('register');
};
