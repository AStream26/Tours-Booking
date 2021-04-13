const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { findOneAndReplace } = require('./tourmodel');

const userSchema  = mongoose.Schema({
       name:{
           type:String,
           required:true
       },
       email:{
           type:String,
           required:[true,"please enter your email"],
           unique:true,
           lowercase:true,
           validate:[validator.isEmail,'Please enter correct email']

       },
       photo:String,
       Password:{
           type:String,
           minLength:8,
           required:[true,"Please enter Password"],
           select:false
       },
       confirmPassword:{
           type:String,
           required:[true,"please confirm your password"],
        
           validate:{//run only for save and create not on findByIdAndUpdate
               validator:function(el){
                   return el===this.Password;
               },
               message:"Password Must Match"
           }
       },
       passwordChangeAt:Date,
       role:{
           type:String,
           enum:["admin","user","lead-guide","guide"],
           default:"user"
       },
       passwordResetToken : String,
       ExpireResetPasswordToken:Date,
       active:{
           type:Boolean,
           default:true,
           select:false
       }
});
userSchema.pre('save',async function(next){
      
    if(!this.isModified('Password'))
    return next();

    this.Password = await bcrypt.hash(this.Password,12);
    this.confirmPassword = undefined;
    next();
});
userSchema.pre('save',function(next){
    if(!this.isModified('Password')||(this.isNew))
    return next();
    //console.log("ab");
    this.passwordChangeAt = Date.now();
    next();
});

userSchema.pre(/^find/,function(next){
    //this point to current query not document
    this.find({active:{$ne:false}});
    next();

});
userSchema.methods.checkPassword = async function(candidatepassword,password){

    return  await bcrypt.compare(candidatepassword,password);
}
userSchema.methods.passwordChange = function(JWTtime){
    if(this.passwordChangeAt){
        const time = parseInt(this.passwordChangeAt.getTime()/1000,10);
       // console.log(time,JWTtime);
       return JWTtime < time;
    }
    return false;
}
userSchema.methods.generatePasswordResetToken = function(){
    let resettoken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest('hex');


    const createtokentime = Date.now() + 10*60*1000;
    this.ExpireResetPasswordToken = createtokentime;
    return resettoken;

}


const User = mongoose.model('user',userSchema);
module.exports = User;