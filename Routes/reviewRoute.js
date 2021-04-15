const express = require('express');
const Reviewcontrol = require('./../controllers/reviewcontroller.js');
const Authcontroller = require('./../controllers/Authcontroller.js');
const app = express();
const Router  = express.Router({
    mergeParams:true
});

Router.use(Authcontroller.protect);

Router.route('/').get(Reviewcontrol.getAllreview).post(Authcontroller.validateuser("user"),Reviewcontrol.getReviewID,Reviewcontrol.createReview);
Router.route('/:id').patch(Authcontroller.validateuser("user","admin"),Reviewcontrol.updateReview).delete(Authcontroller.validateuser("user","admin"),Reviewcontrol.deleteReview);
module.exports = Router;