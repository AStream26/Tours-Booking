const Tour = require('../models/tourmodel');
const User = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');
const Errorhandler = require('../utils/Errorhandle');
const Book = require('../models/bookingmodel');

exports.getOverview = catchAsync(async (req,res,next)=>{
  //1 get tour data from collection
  //2 build the template
  //3 render the template

  const tours = await Tour.find();

res.status(200).render('overview',{
        title:"All Tours",
        tours
    });
 });

 exports.getTour = catchAsync(async (req,res,next)=>{
    //1) getting the tour data including guide and review
    //2) build the template
    //3) render the template
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    });

    if(!tour){
      return next (new Errorhandler('There is no tour with that name',404));
    }
    //console.log(tour.reviews);
    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('tour',{
        tour,
        title:tour.name
    });
 });

 exports.login = catchAsync(async (req,res,next)=>{
   
    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('login',{
        title:"Login"
    });
 });


 exports.signup = catchAsync( async(req,res,next)=>{
   
   res.status(200).render('signup',{
     title:"Signup"
   });
     
 });

 exports.account = catchAsync(async (req,res,next)=>{
   
  res.status(200).set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ).render('account',{
      title:"Your Account"
  });
});

exports.submitdata = catchAsync(async (req,res,next)=>{
   
  const updateduser = await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },{
    new:true,
    runValidators:true
  });
   
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  ).render('account',{
    title:"Your Account",
    user:updateduser
});
});


exports.getBooking = catchAsync(async(req,res,next)=>{
 // console.log(req.user.id);
   
 //1 find all the booking
  const Booking = await Book.find({user:req.user.id});

  //2 find tour ids
  const ids = Booking.map(el=>el.tour.id);
  
  //3 find all tours with their ids
  const tours  = await Tour.find({_id:{$in : ids}});
 // console.log(Booking);
  res.status(200).render('overview',{
    title:'My Tours',
    tours
  });

});