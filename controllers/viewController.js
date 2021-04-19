const Tour = require('../models/tourmodel');
const catchAsync = require('../utils/catchAsync');

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