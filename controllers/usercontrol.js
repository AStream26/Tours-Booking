const catchAsync = require('./../utils/catchAsync.js');
const sharp = require('sharp');
const Users = require('./../models/usermodel.js');
const User = require('./../models/usermodel.js');
const AppError = require('../utils/Errorhandle.js');
const factory = require('./factoryhandler');
const multer = require('multer');

// const multerStorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'public/img/users')
//     },
//     filename:(req,file,cb)=>{
//         //user-id-0202.jpeg
//         const extension = file.mimetype.split('/')[1];
//         cb(null,`user-${req.user.id}-${Date.now()}.${extension}`);
//     }
// });
const multerStorage = multer.memoryStorage(); //to store in memory not in disk
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError("Not an Image ,Please Upload Image only !!",400),false);
    }
}
const upload = multer({
   storage:multerStorage,
   fileFilter:multerFilter

});

exports.resizeImage =catchAsync( async  (req,res,next)=>{
    if(!req.file)
    return next();
   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
   await  sharp(req.file.buffer).resize(500,500)
                          .toFormat('jpeg')
                          .jpeg({quality:90})
                          .toFile(`public/img/users/${req.file.filename}`);
    next();


}
)
//Image uploading
exports.userPhoto = upload.single('photo');

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
    //  console.log(req.file);
    //  console.log(req.body);
    const canUpdate = ['email','name'];

    if(req.body.Password||req.body.confirmPassword)
    return next(new AppError(`Password can't be updated using this route !!!`,500));
 
    const obj = filterObject(req.body,canUpdate);
    if(req.file)
    obj.photo = req.file.filename;
   
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
