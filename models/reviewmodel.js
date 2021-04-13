const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review cannot be empty']
    },
    ratting:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
     type:Date,
     default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A review must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A review must belong to a user']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

reviewSchema.pre(/^find/,function(next){
//    this.populate({ It will cause populate chain
//        path:'tour',
//        select:'name'
//    }).populate({
//        path:'user',
//        select:'name photo'
//    });
this.populate({
    path:'user',
    select:'name photo'
});
});



const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;