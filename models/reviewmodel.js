const mongoose = require('mongoose');
const Tour = require('./tourmodel');

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review cannot be empty']
    },
    ratting:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0']
    },
    ratingAverage:{
       type:Number,
       default:4.5,
       min:[1,'Rating must be above 1.0'],
       max:[5,'Rating must be below 5.0']
    },
    ratingQuantity:{
       type:Number,
       default:0
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

reviewSchema.statics.calAverage = async function(tourid){
    const stats = await this.aggregate([
     {
         $match:{tour:tourid}
     },
     {
         $group:{
             _id:'$tour',
             nrating:{$sum:1},
             avgRating:{$avg:'$rating'}

         }
     }
    ]);

   if(stats.length>0){
    await Tour.findByIdAndUpdate(tourid,{
        ratingQuantity:stats[0].nrating,
        ratingAverage:stats[0].avgRating
       });
   }
   else{
    await Tour.findByIdAndUpdate(tourid,{
        ratingQuantity:1,
        ratingAverage:4.5
       });
   }
}
reviewSchema.post('save',function(){
    this.constructor.calAverage(this.tour);
    next();
})


const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;