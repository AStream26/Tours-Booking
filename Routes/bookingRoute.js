const express = require('express');
const Reviewcontrol = require('./../controllers/reviewcontroller.js');
const BookControl = require('../controllers/bookingcontroller');
const Authcontroller = require('./../controllers/Authcontroller.js');
const app = express();
const Router  = express.Router();

//app.use(Authcontroller.protect);
Router.get('/checkout-session/:tourid',Authcontroller.protect,BookControl.getCheckoutSession);

app.use(Authcontroller.protect);
app.use(Authcontroller.validateuser('admin','lead-guide'));

Router.route('/').get(BookControl.getall).post(BookControl.create);

Router.route('/:id').patch(BookControl.update).delete(BookControl.delete);




module.exports = Router;
