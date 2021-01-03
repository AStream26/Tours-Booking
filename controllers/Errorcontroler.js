const ApiError = require('./../utils/Errorhandle.js');
module.exports = (err,req,res,next)=>{

    const handleinvalidId_DB = (error)=>{
        let message = `Invalid ${error.path} ${err.value}`;
        return new ApiError(message,400);
    }
    const DupicateError = (error)=>{
        let message = `Duplicate keys Enter unique value`;
        return new ApiError(message,400);
    }
   
    const sendErrordevelopment = (err,res)=>{
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            error:err,
            stack:err.stack
        });
    }
    const sendErrorProduction = (err,res)=>{
 //  console.log(err.error);
        if(err.isoperational){
            res.status(err.statusCode).json({
                status:err.status,
                message:err.message
            });
        }
        else{
            res.status(500).json({
                status:"error",
                message:"Something went very wrong"
            });
        }
      
    }
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";


    if(process.env.NODE_ENV==='development'){
        sendErrordevelopment(err,res);

    }else if(process.env.NODE_ENV==='production'){
        const error ={...err};
        if(error.kind==='ObjectId'){
            error = handleinvalidId_DB(error);
        }

        if(error.code===11000){
            error = DupicateError(error);
        }
            sendErrorProduction(error,res);
    }
    
   
 }