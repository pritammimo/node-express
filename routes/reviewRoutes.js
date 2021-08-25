const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { deleteReview, updateReview, getReview } = reviewController;
const { getAllReviews, createReview, setTourUserIds } = reviewController;
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);
module.exports = router;
router.route('/:id').get(getReview).delete(deleteReview).patch(updateReview);
