const tourcontrol = require('../controllers/tourcontrol.js');
const express = require('express');
const app = express();
const tourrouter = express.Router();
// tourrouter.param('id',tourcontrol.checkid);





//creating and mounting router
tourrouter.route('/get-5-cheap').get(tourcontrol.aliasing,tourcontrol.getAlltour);
tourrouter.route('/get-tour-stats').get(tourcontrol.getstats);
tourrouter.route('/get-monthly-plans/:year').get(tourcontrol.getmonthelyplan);

tourrouter.route('/').get(tourcontrol.getAlltour).post(tourcontrol.newtour);
tourrouter.route('/:id').get(tourcontrol.gettour).patch(tourcontrol.updatetour).delete(tourcontrol.deletetour);

module.exports = tourrouter;