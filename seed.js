const fs = require('fs');
const dotenv = require('dotenv');

const mongoose  = require('mongoose');
dotenv.config({path :`./config.env`});

const Tour = require('./models/tourmodel.js');
const USER = require('./models/usermodel.js');
const REVIEW = require('./models/reviewmodel.js');


const DB  = process.env.DATABASE;
//console.log(DB);
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json','utf-8'));
const users = JSON.parse(fs.readFileSync('./dev-data/data/users.json','utf-8'));
const review = JSON.parse(fs.readFileSync('./dev-data/data/reviews.json','utf-8'));
mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(con =>{
    //console.log(con.connections);
    console.log('Connected');
});


const importdata = async ()=>{
    try{await Tour.create(tours);
        await USER.create(users,{validateBeforeSave:false});
        await REVIEW.create(review);
   
  
   
   console.log("Data Successfully Added");

    }catch(err){
        console.log(err);
    }
    process.exit();
}
const deletedata = async ()=>{
    try{
   await Tour.deleteMany();
   await User.deleteMany();
   await REVIEW.deleteMany();
   console.log("Data Successfully Deleted");

    }catch(err){
        console.log(err);
    }
    process.exit();
}
if(process.argv[2]==='--import'){
    importdata();
}
else if(process.argv[2]==='--delete'){
    deletedata();
}


