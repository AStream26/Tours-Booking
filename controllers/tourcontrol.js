const Tour = require('./../models/tourmodel.js');
const APIFeatures = require('./../utils/apifeatures.js');
const catchAsync = require('./../utils/catchAsync.js');
const ErrorHandle = require('./../utils/Errorhandle.js');

//Aliasing
exports.aliasing = (req,res,next)=>{

    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,duration,summary,ratingAverage';
    next();
}

//Error Handling

exports.getAlltour = catchAsync(async (req,res,next)=>{
   // console.log(new ApiFeatures());
    //Executing the query
    const filter = new APIFeatures(Tour.find(),req.query).filter().sort().limitFeild().pagitaion();
    //console.log(filter);
   const tours = await filter.query;
 
   res.status(200).json({
    status:'success',
    data:{
      tours
    }
});
//     try{

//     //Executing the query
//     const filter = new APIFeatures(Tour.find(),req.query).filter().sort().limitFeild().pagitaion();
//     //console.log(filter);
//    const tours = await filter.query;
 
//    res.status(200).json({
//     status:'success',
//     data:{
//       tours
//     }
// });

//     }catch(err){
//         res.status(404).json({
//          status:'fail',
//          message:err
//         });

//     }
   
});

exports.gettour =catchAsync(async (req,res,next)=>{
    const tour = await Tour.findById(req.params.id);
     
    if(!tour){ //handlig tour null error 404
      return next(new ErrorHandle("Tour cannot be foud",404));
    }
    // const tour = tours.find(el =>el.id ===id);
    res.status(200).json({
        status:'success',
        data:{
          tours:tour
        }
    });
//    try{
//     // const id = + req.params.id;
//     const tour = await Tour.findById(req.params.id);

//    // const tour = tours.find(el =>el.id ===id);
//    res.status(200).json({
//        status:'success',
//        data:{
//          tours:tour
//        }
//    });
//    }catch(err){
//       res.status(404).json({
//       status:'Fail',
//       message:err
//       });
// }
  });

  exports.newtour =catchAsync( async (req,res,next)=>{
    //  console.log("adding....");
    const newtour = await Tour.create(req.body);

    res.status(201).json({
      status:'success',
      data :{
          tour:newtour
      }
  });
    //   try{
    //       const newtour = await Tour.create(req.body);

    //       res.status(201).json({
    //         status:'success',
    //         data :{
    //             tour:newtour
    //         }
    //     });

    //   } catch(err){
    //       res.status(400).json({
    //          status:'fail',
    //          message:err
    //       });
    //   }
  
    });

    exports. updatetour =catchAsync( async (req,res,next)=>{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        if(!tour){ //handlig tour null error 404
            return next(new ErrorHandle("Tour cannot be foud",404));
          }

        res.status(200).json({
           status:'success',
           data:{
             tour
           }
       });
    //    try{
    //      const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
    //          new:true,
    //          runValidators:true
    //      });

    //      res.status(200).json({
    //         status:'success',
    //         data:{
    //           tour
    //         }
    //     });

    //    }catch(err){
    //        res.status(404).json({
    //            status:'Fail',
    //            message:err
    //        });

    //    }
});
exports.deletetour =catchAsync( async (req,res,next)=>{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:'success',
        data:{
          tours:null
        }
    });
 
//   try{
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//         status:'success',
//         data:{
//           tours:null
//         }
//     });

//   }catch(err){
//     res.status(404).json({
//         status:'Fail',
//         message:err
//     });
//   }
     

});

exports.getstats =catchAsync( async (req,res,next)=>{
    const stats = await Tour.aggregate([
        {$match:{ratingsAverage:{$gte:4.5}}
       },
        {
         $group:{
             _id:{$toUpper :'$difficulty'},
             numTour:{$sum:1},
             avgRating:{$avg:'$ratingsAverage'},
             avgPrice:{$avg:'$price'},
             minPrice:{$min:'$price'},
             maxPrice:{$max:'$price'}

                }   
        },
        {
            $sort :{avgPrice:1}
        }
       //  },
       //  {$match:{_id:{$ne:'EASY'}}}
       ]);
       res.status(200).json({
           status:'success',
           data:{
             stats
           }
       });

    // try{
    //     const stats = await Tour.aggregate([
    //      {$match:{ratingsAverage:{$gte:4.5}}
    //     },
    //      {
    //       $group:{
    //           _id:{$toUpper :'$difficulty'},
    //           numTour:{$sum:1},
    //           avgRating:{$avg:'$ratingsAverage'},
    //           avgPrice:{$avg:'$price'},
    //           minPrice:{$min:'$price'},
    //           maxPrice:{$max:'$price'}

    //              }   
    //      },
    //      {
    //          $sort :{avgPrice:1}
    //      }
    //     //  },
    //     //  {$match:{_id:{$ne:'EASY'}}}
    //     ]);
    //     res.status(200).json({
    //         status:'success',
    //         data:{
    //           stats
    //         }
    //     });

    // }catch(err){
    //     res.status(404).json({
    //         status:'Fail',
    //         message:err
    //     });
    // }
});

exports.getmonthelyplan =catchAsync( async (req,res,next)=>{
    const year = + req.params.year;
       // console.log(year);
        const plan  =await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            
            {
                $match :{ startDates :
                               {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }

                }
            },
            
            
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                  }
            },
            {
                $addFields:{month : '$_id'}
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{numTourStarts:-1}
            },
            {
                $limit:6
            }
        ]);

        res.status(200).json({
            status:'success',
            data:{
              plan
            }
        });

    // try{
    //     const year = + req.params.year;
    //    // console.log(year);
    //     const plan  =await Tour.aggregate([
    //         {
    //             $unwind:'$startDates'
    //         },
            
    //         {
    //             $match :{ startDates :
    //                            {
    //                 $gte: new Date(`${year}-01-01`),
    //                 $lte: new Date(`${year}-12-31`)
    //             }

    //             }
    //         },
            
            
    //         {
    //             $group: {
    //                 _id: { $month: '$startDates' },
    //                 numTourStarts: { $sum: 1 },
    //                 tours: { $push: '$name' }
    //               }
    //         },
    //         {
    //             $addFields:{month : '$_id'}
    //         },
    //         {
    //             $project:{_id:0}
    //         },
    //         {
    //             $sort:{numTourStarts:-1}
    //         },
    //         {
    //             $limit:6
    //         }
    //     ]);

    //     res.status(200).json({
    //         status:'success',
    //         data:{
    //           plan
    //         }
    //     });


    // }catch(err){
    //     res.status(404).json({
    //         status:'Fail',
    //         message:err
    //     });
    // }
});





//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'));

// exports.checkid = (req,res,next,id)=>{
//     if(req.params.id>tours.length){
//        return  res.status(404).json({
//             status:"fail",
//             message:"Data not Found"
//         });
//     }
//     next();
// }
// exports.checkbody  = (req,res,next)=>{
//     if(!req.params.name || !req.params.price){
//         return res.status(400).json({
//             status:"Bad Request",
//             message:"Price or name missing"
//         });
//     }
//     next();
// }