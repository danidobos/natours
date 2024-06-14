const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//  3. ROUTES
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Middlewares always come in sequence. So after the first 4 route, we can use middleware on router, to make every route protected from now on.
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// From now only admin users can perform these actions
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
