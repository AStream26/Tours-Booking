const mongoose = require('mongoose');
const Bookingschema  = mongoose.Schema({
        
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A Booking must belong to a Tour !!']
    },
    user:{
    type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A Booking must belong to a User !!']
    },
    paid:{
        type:Boolean,
        default:true
    },
    price:{
        type:Number,
        required:[true,'A Booking must have a price !!']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

   
});

Bookingschema.pre(/^find/,function(next){
    console.log("populate");
    this.populate('user').populate({
        path:'tour',
        select:'name'
    });
    next();
})

const Booking = mongoose.model('Booking',Bookingschema);

module.exports = Booking;
