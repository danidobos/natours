const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// This middleware will only apply when there is id param in the url
// In this case the callback fn has a 4th param --> the value that we are looking for
router.param('id', tourController.checkID);

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
