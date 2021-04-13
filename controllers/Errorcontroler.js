const ApiError = require('./../utils/Errorhandle.js');

const handleinvalidId_DB = (error)=>{
    let message = `Invalid ${error.path} ${err.value}`;
    return new ApiError(message,400);
}
const DupicateError = (error)=>{
    let message = `Duplicate keys Enter unique value`;
    return new ApiError(message,400);
}

const jsonwebtokenerror = (error) =>new ApiError(`invalid Token .Please try again`,401); 
const jsonexpireerror  = (error) => new ApiError(`your token has been expired.Login again!!`,401);

const sendErrordevelopment = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    });
}
const sendErrorProduction = (err,res,message)=>{
//console.log(err.message);
    if(err.isoperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message?err.message:message
        });
    }
    else{
        //console.log(err);
        res.status(500).json({
            status:"error",
            message:"Something went very wrong"
        });
    }
  
}








module.exports = (err,req,res,next)=>{

  let message = err.message;
  //console.log("kk",message);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    
    if(process.env.NODE_ENV==='development'){
        sendErrordevelopment(err,res);

    }else if(process.env.NODE_ENV==='production'){
      
        let error ={...err};
        console.log(Object.keys(err));
        if(error.kind==='ObjectId'){
            error = handleinvalidId_DB(error);
        }

        if(error.code===11000){
            error = DupicateError(error);
        }
        if(error.name==="JsonWebTokenError")
        error = jsonwebtokenerror(error);
         if(error.name==="TokenExpiredError")
         error = jsonexpireerror(error);

            sendErrorProduction(error,res,message);
    }
    
   
 }