const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// We can "chain" multiple middlewares in a route fe.: before create, we check, if the
// req. body contains name and price, if yes only then create the tour
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
