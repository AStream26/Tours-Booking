const tourcontrol = require('../controllers/tourcontrol.js');
const express = require('express');
const app = express();
const tourrouter = express.Router();
tourrouter.param('id',tourcontrol.checkid);





//creating and mounting router

tourrouter.route('/').get(tourcontrol.getAlltour).post(tourcontrol.checkbody,tourcontrol.newtour);
tourrouter.route('/:id').get(tourcontrol.gettour).patch(tourcontrol.updatetour).delete(tourcontrol.deletetour);

module.exports = tourrouter;