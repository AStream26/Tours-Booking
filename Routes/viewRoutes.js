const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const Authcontroller = require('../controllers/Authcontroller');
const { route } = require('./userRouter');
const Bookcontrol = require('../controllers/bookingcontroller');

//router.use(Authcontroller.isLogined);

  router.get('/',Bookcontrol.CreateBooking,Authcontroller.isLogined,viewController.getOverview);
  
  router.get('/tour/:slug',Authcontroller.isLogined,viewController.getTour);
  router.get('/login',Authcontroller.isLogined,viewController.login);
  router.get('/me',Authcontroller.protect,viewController.account);
  router.post('/submit-user-data',Authcontroller.protect,viewController.submitdata);
  router.get('/my-booking',Authcontroller.protect,viewController.getBooking);


module.exports = router;