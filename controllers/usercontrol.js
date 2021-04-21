const catchAsync = require('./../utils/catchAsync.js');
const Users = require('./../models/usermodel.js');
const User = require('./../models/usermodel.js');
const AppError = require('../utils/Errorhandle.js');
const factory = require('./factoryhandler');



const filterObject = (obj,field)=>{
    let newobj={};
    Object.keys(obj).forEach(el=>{
        if(field.includes(el)){
            newobj[el] = obj[el];
        }
    });
    return newobj;
}

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}
exports.updateMe = catchAsync(async (req,res,next)=>{
     
    const canUpdate = ['email','name'];

    if(req.body.Password||req.body.confirmPassword)
    return next(new AppError(`Password can't be updated using this route !!!`,500));
 
    const obj = filterObject(req.body,canUpdate);
   
    const updateduser = await User.findByIdAndUpdate(req.user.id,obj,{
        runValidators:true,
        new:true
    });
    
    res.status(200).json({
        status:"success",
        data:{
            user:updateduser
        }
    });

});

exports.deleteMe = catchAsync(async (req,res,next)=>{

    const user =  await User.findByIdAndUpdate(req.user._id,{active:false});
    

    res.status(204).json({
        status:"succes",
        data:null
    });
});


exports.getuser =factory.getOne(User);
exports. getAllusers =factory.getALL(User);
exports. updateuser =factory.updateOne(User);
exports. deleteuser = factory.deleteOne(User);

exports. newuser = (req,res)=>{
    res.status(500).json({
        status:"Error",
        message:"Route not defined"
    });
}
