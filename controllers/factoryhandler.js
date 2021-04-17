const catchAsync = require('./../utils/catchAsync.js');
const ErrorHandle = require('./../utils/Errorhandle.js');
const APIFeatures = require('./../utils/apifeatures.js');


exports.getALL = (Modal)=>catchAsync(async (req,res,next)=>{
  // console.log(new ApiFeatures());
   //Executing the query
  console.log("AVVVIII");
   const fi  = {};//for nested review route
   if(req.params.tourid)fi = {
       tour:req.params.tourid
   }
   const filter = new APIFeatures(Modal.find(fi),req.query).filter().sort().limitFeild().pagitaion();
  // console.log(filter);
  const doc = await filter.query;
 // console.log(doc);
  res.status(200).json({
   status:'success',
   data:{
     data:doc
   }
});
});

exports.deleteOne = Modal=> catchAsync( async (req,res,next)=>{
  const doc = await Modal.findByIdAndDelete(req.params.id)

    if(!doc){
        return next(new ErrorHandle("doc cannot be foud",404));
    }
    res.status(204).json({
        status:'success',
        data:{
          data:null
        }
    })
});

exports.updateOne = Modal =>catchAsync( async (req,res,next)=>{
  const doc = await Modal.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
  });

  if(!doc){ //handlig doc null error 404
      return next(new ErrorHandle("doc cannot be foud",404));
    }

  res.status(200).json({
     status:'success',
     data:{
       data:doc
     }
 });
}); 

exports.createOne = Modal=> catchAsync( async (req,res,next)=>{
  //  console.log("adding....");
  const doc = await Modal.create(req.body);

  res.status(201).json({
    status:'success',
    data :{
        data:doc
    }
});
});

exports.getOne = (Modal,popoptions) =>catchAsync(async (req,res,next)=>{
  let query =  Modal.findById(req.params.id);
  if(popoptions)
  query = query.populate(popoptions);
  const doc = await query;
   
  if(!doc){ //handlig doc null error 404
    return next(new ErrorHandle("doc cannot be foud",404));
  }
  // const doc = docs.find(el =>el.id ===id);
  res.status(200).json({
      status:'success',
      data:{
        data:doc
      }
  });
});

