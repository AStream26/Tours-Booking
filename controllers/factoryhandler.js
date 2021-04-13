const catchAsync = require('./../utils/catchAsync.js');
const ErrorHandle = require('./../utils/Errorhandle.js');

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
})

