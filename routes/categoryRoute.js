const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();
router.route('/').post(categoryController.createCategory);
router.route('/:id').delete(categoryController.deleteCategory);
router.route('/:id').put(categoryController.updateCategory);
router.route('/:id').get(categoryController.getCategoryJson);

module.exports = router;