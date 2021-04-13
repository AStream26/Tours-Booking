const express = require('express');
const Reviewcontrol = require('./../controllers/reviewcontroller.js');
const Authcontroller = require('./../controllers/Authcontroller.js');
const app = express();
const Router  = express.Router({
    mergeParams:true
});


Router.route('/').get(Reviewcontrol.getAllreview).post(Authcontroller.protect,Authcontroller.validateuser("user"),Reviewcontrol.getReviewID,Reviewcontrol.createReview);
Router.route('/:id').delete(Reviewcontrol.deleteReview);
module.exports = Router;