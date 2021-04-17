const mongoose  = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path :'./config.env'});

process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    process.exit(1);//unhadled exception
    
});
//console.log(x);
const app = require('./app.js');
const tourrouter = require('./Routes/tourRoute.js');
const DB  = process.env.DATABASE;
mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(con =>{
    //console.log(con.connections);
    console.log('Connected');
});

// const newTour = new Tour({
//     name:'The Great India Tour',
//     price:112,
//     rating:4.9
//     });
//     newTour.save().then(res=>{
//        console.log(res);
//     });
const port  = process.env.PORT ||3000;
const server = app.listen(port,()=>{
    console.log("Server Started");
});


process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    server.close(()=>{
        console.log("Shutting Down the server......");
        process.exit(1);//unhadled exception
    });
});




 //save