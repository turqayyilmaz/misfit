const express = require('express')
const {body} = require('express-validator');



const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const User = require('../models/User');

const router = express.Router();

router.route('/register').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);
router.route('/:id').delete(authController.deleteUser);
router.route('/:id').put(authController.updateUser);
router.route('/profileImage/:id').post(authController.addProfilePhoto);
module.exports = router;