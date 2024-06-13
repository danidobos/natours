const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Previously we had a problem. We had a review route in tourRouter, just because the endpoint started with 'tours'. That's not a good practice, as it makes the code messy, and harder to maintain. A solution for this is route merging. We import the review router here, and basically "tells" node.js to use the review router when a request hits "/tours/:tourId/reviews". We mount the review router here.
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
