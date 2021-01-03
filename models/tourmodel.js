const { findSourceMap } = require('module');
const mongoose  = require('mongoose');
const slugify = require('slugify');
const tourSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'A tour name is required']
    },
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    slug:String,
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
   difficulty:{
       type:String,
       required:[true,'A tour must have a difficulty']
   },
    price :{
        type:Number,
        required:[true,'A tour must have a price']
    },
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        trim:true
    },
    summary:{
        type:String,
        trim:true
    },
    priceDiscount:Number,
    imageCover:{
        type:String,
        required:[true,'A tour must have a image cover']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationweek').get(function(){
    return this.duration/7;
});
//DOCUMENT MIDDLEWARE
// tourSchema.pre('save',function(){
//       this.slug = slugify(this.name,{lower:true});
// });

// tourSchema.post('save',function(doc,next){
//      console.log(doc);
//      next();
// });
//QUERY MIIDLEWARE
tourSchema.pre(/^find/,function(next){
     this.find({secretTour:{$ne:true}});
     this.start = Date.now();
     next();
});
tourSchema.post(/^find/,function(docs,next){
    console.log(Date.now()-this.start);
    next();
});

//AGGREGATE MIDDDLEWARE
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
next();
});
const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;












