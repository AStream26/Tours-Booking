
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourmodel.js');
const APIFeatures = require('./../utils/apifeatures.js');
const catchAsync = require('./../utils/catchAsync.js');
const ErrorHandle = require('./../utils/Errorhandle.js');
const factory = require('./factoryhandler');
const Book = require('../models/bookingmodel');
const User = require('../models/usermodel.js');



exports.alert = (req,res,next)=>{
    const {alert} = req.query;

    if(alert==='booking'){
        res.locals.alert = 'Your Booking is SuccesFull Please Check Your email for conformation !!';
    }
    next();
}

exports.getCheckoutSession = catchAsync( async (req,res,next)=>{
     // console.log("AAAA");
    //1 Get the tour data
    const tour = await Tour.findById(req.params.tourid);
    
    //2 Create a stripe session
// success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourid}&user=${req.user.id}&price=${tour.price}`,//
  const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      success_url:`${req.protocol}://${req.get('host')}/my-booking/?alert=booking`,
      cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email:req.user.email,
      client_reference_id:req.params.tourid,

      line_items:[{
          name:`${tour.name} Tour`,
          description:`${tour.summary}`,
          images:[`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
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

// exports.CreateBooking = catchAsync(async(req,res,next)=>{
//     // Temporary as not secure to use 
//     const {tour,user,price} = req.query;

//     if(!user && !tour && !price)  return next();

//     await Book.create({user,tour,price});


//     res.redirect(req.originalUrl.split('?')[0]);
    

// });
 
const CreateBooking = async session =>{
    const tour = session.client_reference_id;
    const user = (await User.findOne({email:session.customer_email})).id;
    const price = session.amount_subtotal;
    await Book.create({user,tour,price});
}

exports.webhookcheckot = (req,res,next)=>{
const signature = req.headers['stripe-signature'];
let event;
try{
     event = stripe.webhooks.constructEvent(req.body,
        signature,
         process.env.STRIPE_WEBHOOK_SECRET);
}
catch(err){
    return res.status(400).send(`WebHook Error ${err.message}`)
}
if(event.type ==='checkout.session.completed'){
  CreateBooking(event.data.object);
}

res.status(200).json({recived:true});

    
}



exports.create = factory.createOne(Book);
exports.delete = factory.deleteOne(Book);
exports.update = factory.updateOne(Book);
exports.getall = factory.getALL(Book);
exports.getone = factory.getOne(Book);

