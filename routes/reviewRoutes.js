const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { deleteReview } = reviewController;
const { getAllReviews, createReview } = reviewController;
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);
module.exports = router;
router.route('/:id').delete(deleteReview);
