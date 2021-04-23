const User  = require('./../models/usermodel.js');
const catchAsync = require('./../utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/Errorhandle.js');
const {promisify} = require('util');
const crypto = require('crypto');
const Email = require('./../utils/email.js');


const generatetoken = (id)=>{
   return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIREIN
    });
}

const SendToken = (user,statusCode,res)=>{
    const token  = generatetoken(user._id);
  //console.log(token);
    const options = {
        expires :new Date(Date.now()+(process.env.COOKIES_EXPIRE *24 *60 *60 *1000)),
        httpOnly:true
    }
    user.password = undefined;
    if(process.env.NODE_ENV ==='production')
    options.secure  = true;

    res.cookie('jwt',token,options);

    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    });

}
exports.singup =   catchAsync( async (req,res,next)=>{
  //  console.log("SS");
   
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser,url).sendWelcome();
   // console.log(newUser);
   SendToken(newUser,200,res);
});
exports.login =  catchAsync( async (req,res,next)=>{
    const {email,password} = req.body;
    // 1) check if email and password exists

    if(!email || !password){
        return next(new AppError("Please Enter valid Email or Password",400));
    }
  //2) check if user exists or not
//  console.log(email,password);
  const user = await User.findOne({email:email}).select('+password');
 // console.log(user);
  if(!user || ! await user.checkPassword(password,user.password))
  return next(new AppError('email or password is incorrect',400));

    //3) send token to the user if verification is succesfull
    SendToken(user,200,res);
   
});


exports.protect=   catchAsync(  async (req,res,next)=>{

   //1) Getting token from HTTP header
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
   token = req.headers.authorization.split(' ')[1];
  // console.log(token);
   }
   else if(req.cookies.jwt){
       token  = req.cookies.jwt;
      // console.log(token);
   }
   
   if(!token){
   // console.log("a");
       return next(new AppError('You are not logind in!!!!',401));
   }
   //2) verification of the token
   const decoded =  await promisify(jwt.verify)(token,process.env.JWT_SECRET);
 //  console.log(decoded);


 //checking if user exists or not
 const freshuser = await User.findById(decoded.id);
 //console.log(freshuser);
 if(!freshuser){
     return next(new AppError('The token no longer exist!!',401));
 }
 //check if user has changed the password after the token was issued 
 if(freshuser.passwordChange(decoded.iat)){
     return next(new AppError('User has recently changed password !! Please Login again!'));
 }


 //grant access to protected route
 res.locals.user = freshuser;
 //console.log(res.locals.user);
 req.user = freshuser;
 
    next();

});



//for rendered pages 
exports.isLogined=     async (req,res,next)=>{

        //1) Getting token from cookies

        if(req.cookies.jwt){

       try{
            //2) verification of the token
        const decoded =  await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
    
    
        //checking if user exists or not
        const currentuser = await User.findById(decoded.id);
        if(!currentuser){
            return next();
        }
    
        //check if user has changed the password after the token was issued 
        if(currentuser.passwordChange(decoded.iat)){
            return next();
        }
        
        
        //there is a logined user
        res.locals.user = currentuser;
          return next();
       }catch(err){
          return  next();
       }
    
        
    }
   next();
 };






exports.validateuser = (...roles)=>{

    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role)){
            return next(new AppError("You don't have permission to perform this action !!!",403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync( async (req,res,next)=>{
    //getting the user 
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new AppError('Given Email does not exist !!',404));

    }

    //genertaing random reset token 
    const resetToken  = user.generatePasswordResetToken();
    //console.log(resetToken);
    await user.save({validateBeforeSave :false});
   // const reseturl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    //console.log(reseturl);
    //const message = `Please Follow the link provided to reset your password : ${reseturl} .`;

    //sending it to user via email
   try{
    const reseturl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    await new Email(user,reseturl).sendforgotPassword();

       res.status(200).json({
           status:"success",
           message:"Token send to E-mail"
       });
  

   }catch(err){
        user.passwordResetToken = undefined;
        user.ExpireResetPasswordToken = undefined;
        await user.save({validateBeforeSave :false});
        return next(new AppError('There was an Error While Sending Mail!!!',500));
   }



});
exports.resetpassword = catchAsync(async (req,res,next)=>{
    //1)getting the token and encrpting it
    const token = req.params.token;

    const encrpttoken = crypto.createHash('sha256').update(token).digest('hex');
    //2)getting the user based on token and expirationtime
    const user = await User.findOne({passwordResetToken:encrpttoken,ExpireResetPasswordToken:{$gt:Date.now()}});
    if(!user){
        return next(new AppError('Token has been expired or is invalid!!!',400));

    }
    user.password = req.body.password;
    user.confirmPassword = req.body.password;
    user.passwordResetToken = undefined;
    user.ExpireResetPasswordToken = undefined;
    await user.save();

    //Login the user in

    SendToken(user,200,res);


});



exports.updatePassword = catchAsync(async (req,res,next)=>{
  
const id = req.user.id;
//console.log(id);
const user = await User.findById(id).select('+password');

const {password,newPassword,confirmpassword} = req.body;
//console.log(user.password);
if(await (!user.checkPassword(password,user.password)))
return next(new AppError('Incorrect Password !!!',500));



user.password = newPassword;
user.confirmPassword = confirmpassword;
await user.save();

SendToken(user,200,res);

});

exports.logout = (req,res)=>{
    //console.log("ajjsjs");
    res.cookie('jwt','loggedout',{
     
        expires:new Date(Date.now()+(10*1000)),
        httpOnly:true
    });

    res.status(200).json({status:'success'});
}
