const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const Authcontroller = require('../controllers/Authcontroller');
const { route } = require('./userRouter');

router.use(Authcontroller.isLogined);

  router.get('/',viewController.getOverview);
  
  router.get('/tour/:slug',viewController.getTour);
  router.get('/login',viewController.login);


module.exports = router;