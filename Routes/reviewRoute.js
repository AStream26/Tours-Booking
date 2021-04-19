const express = require('express');
const Reviewcontrol = require('./../controllers/reviewcontroller.js');
const Authcontroller = require('./../controllers/Authcontroller.js');
const app = express();
const reviewrouter  = express.Router({
    mergeParams:true
});

reviewrouter.use(Authcontroller.protect);

reviewrouter.route('/').get(Reviewcontrol.getAllreview).post(Authcontroller.validateuser("user"),Reviewcontrol.getReviewID,Reviewcontrol.createReview);
reviewrouter.route('/:id').get(Reviewcontrol.getReview).patch(Authcontroller.validateuser("user","admin"),Reviewcontrol.updateReview).delete(Authcontroller.validateuser("user","admin"),Reviewcontrol.deleteReview);
module.exports = reviewrouter;