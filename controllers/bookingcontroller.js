
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourmodel.js');
const APIFeatures = require('./../utils/apifeatures.js');
const catchAsync = require('./../utils/catchAsync.js');
const ErrorHandle = require('./../utils/Errorhandle.js');
const factory = require('./factoryhandler');
const Book = require('../models/bookingmodel');

exports.getCheckoutSession = catchAsync( async (req,res,next)=>{
     // console.log("AAAA");
    //1 Get the tour data
    const tour = await Tour.findById(req.params.tourid);
    
    //2 Create a stripe session

  const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourid}&user=${req.user.id}&price=${tour.price}`,//
      cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email:req.user.email,
      client_reference_id:req.params.tourid,

      line_items:[{
          name:`${tour.name} Tour`,
          description:`${tour.summary}`,
          images:['https://unsplash.com/photos/eEi28RBojJc'],
          amount:tour.price * 100,
          currency:'inr',
          quantity:1
      }]
  });

  //3) create session as response
  res.status(200).json({
      status:'success',
      session
  });
});

exports.CreateBooking = catchAsync(async(req,res,next)=>{
    // Temporary as not secure to use 
    const {tour,user,price} = req.query;

    if(!user && !tour && !price)  return next();

    await Book.create({user,tour,price});


    res.redirect(req.originalUrl.split('?')[0]);
    

});


exports.create = factory.createOne(Book);
exports.delete = factory.deleteOne(Book);
exports.update = factory.updateOne(Book);
exports.getall = factory.getALL(Book);
exports.getone = factory.getOne(Book);

