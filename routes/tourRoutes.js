const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// This middleware will only apply when there is id param in the url
// In this case the callback fn has a 4th param --> the value that we are looking for
router.param('id', tourController.checkID);

// We can "chain" multiple middlewares in a route fe.: before create, we check, if the
// req. body contains name and price, if yes only then create the tour
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
