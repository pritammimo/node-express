const express = require('express');
const tourController = require('../controllers/tourController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkbody,
} = tourController;
const router = express.Router();

router.param('id', checkID);
//Create a checkbody middlewarre

router.route('/').get(getAllTours).post(checkbody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
module.exports = router;
