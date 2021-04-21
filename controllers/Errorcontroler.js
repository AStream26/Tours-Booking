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

const sendErrordevelopment = (err,req,res)=>{
    //API
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    });
  }
  else{
      //Rendering
      res.status(err.statusCode).render('error',{
          title:"Something Went wrong",
          msg:err.message

      });
  }
}
const sendErrorProduction = (err,req,res,message)=>{
         
    if(req.originalUrl.startsWith('/api')){
       
      //operational error,trusted error send error to the client
    if(err.isoperational){
        return res.status(err.statusCode).json({
            status:err.status,
            message:err.message?err.message:message
        });
    }
    
        console.log("Error",err);
        res.status(500).json({
            status:"error",
            message:"Something went very wrong"
        });
    

    }

    else
    {
        //Rendering to the client

    if(err.isoperational){
        return res.status(err.statusCode).render('error',{
            title:"Something Went wrong",
            msg:err.message
  
        });
    }
    
        //console.log(err);
        return res.status(err.statusCode).render('error',{
            title:"Something Went wrong",
            msg:"Something Went wrong"
  
        });
        
    }
  
}








module.exports = (err,req,res,next)=>{

  let message = err.message;
  //console.log("kk",message);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    
    if(process.env.NODE_ENV==='development'){
        console.log("Development");
        sendErrordevelopment(err,req,res);

    }
    else if(process.env.NODE_ENV==='production'){
        console.log("Production");
        let error ={...err};
        error.message = err.message;
      //  console.log(Object.keys(err));
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

            sendErrorProduction(error,req,res,message);
    }
    
   
 }