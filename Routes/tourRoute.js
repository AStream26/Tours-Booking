const tourcontrol = require('../controllers/tourcontrol.js');
const express = require('express');
const app = express();
const tourrouter = express.Router();
const Authcontroller = require('./../controllers/Authcontroller.js');
const reviewControl = require('../controllers/reviewcontroller.js');
const reviewRoute  = require('./reviewRoute');
// tourrouter.param('id',tourcontrol.checkid);
//const reviewcontroller = require('../controllers/reviewcontroller');

tourrouter.route('/:tourid/review',reviewRoute);
//tourrouter.route('/:tourid/reviews').post(Authcontroller.protect,Authcontroller.validateuser('users'),reviewControl.createReview);

//creating and mounting router
tourrouter.route('/get-5-cheap').get(tourcontrol.aliasing,tourcontrol.getAlltour);
tourrouter.route('/get-tour-stats').get(tourcontrol.getstats);
tourrouter.route('/get-monthly-plans/:year').get(Authcontroller.validateuser("lead-guide","admin","guide"),tourcontrol.getmonthelyplan);


tourrouter.route('/').get(tourcontrol.getAlltour).post( Authcontroller.protect,Authcontroller.validateuser("lead-guide","admin"),tourcontrol.newtour);
tourrouter.route('/:id').get(tourcontrol.gettour).patch(Authcontroller.protect,Authcontroller.validateuser("lead-guide","admin"),tourcontrol.updatetour).delete(Authcontroller.protect,Authcontroller.validateuser("lead-guide","admin"),tourcontrol.deletetour);
tourrouter.route('/:id/review').post(Authcontroller.protect,Authcontroller.validateuser('user'),reviewControl.createReview);


//geo-spatial queries

tourrouter.route('/tour-within/:distance/center/:latlng/unit/:unit').get(tourcontrol.tourwithin);
tourrouter.route('/distances/:latlng/unit/:unit').get(tourcontrol.getDistances);

module.exports = tourrouter;





