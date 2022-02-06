const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
const frontEndController = require('../controller/frontEndController');

router.route('/').get(frontEndController.getIndexPage);
router.route('/about').get(frontEndController.getAboutPage);
router.route('/services').get(frontEndController.getServicesPage);
router.route('/news').get(frontEndController.getNewsPage);
router.route('/trainers').get(frontEndController.getTrainersPage);
router.route('/gallery').get(frontEndController.getGalleryPage);
router.route('/contact').get(frontEndController.getContactPage);
router.route('/login').get(frontEndController.getLoginPage);
router.route('/login').post(frontEndController.checkLogin);
router.route('/register').get(frontEndController.getRegisterPage);
router.route('/register').post(frontEndController.saveUser);
router.route('/logout').get(frontEndController.logout);




module.exports = router;
