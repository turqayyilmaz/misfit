const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
const userController = require('../controller/userController');

router.route('/dashboard').get(userController.getUserDashboard);

router.route('/users').get(userController.getUsersPage);




module.exports = router;