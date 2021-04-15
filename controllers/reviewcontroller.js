const Review = require('./../models/reviewmodel.js');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./factoryhandler');


//get all review
// catchAsync(async (req,res,next)=>{
//      const filter  = {};
//      if(req.params.tourid)filter = {
//          tour:req.params.tourid
//      }
//     const review  = await Review.find(filter);

//     res.status(200).json({
//         status:"success",
//         data:{
//             review
//         }
//     });

// });
exports.getReviewID = (req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourid;
    if(!req.body.user) req.body.user = req.params.id;
    next();
}
exports.getAllreview = factory.getALL(Review);

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);