const User = require('../models/User');

exports.getUserDashboard = (req, res) => {
  res.locals.pageName = 'Dashboard';
  res.locals.pageTitle = 'User Dashboard';

  res.render('user/dashboard');
};

exports.getUsersPage = async (req, res) => {
  res.locals.pageName = 'Users';
  res.locals.pageTitle = 'Users';
    const users = await User.find({});
  res.render('user/adminusers',{users});
};
