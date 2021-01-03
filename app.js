const express = require('express');
const morgan  = require('morgan');
const Error = require('./controllers/Errorcontroler.js');
const AppError = require('./utils/Errorhandle.js');
const userrouter = require('./Routes/userRouter');
const tourrouter = require('./Routes/tourRoute');
const app = express();

app.use(express.static(`${__dirname}/public`));
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(express.json());//for post request to get data
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
});








// app.get('/api/v1/tours',getAlltour);
// app.get('/api/v1/tours/:id',gettour);
// app.post('/api/v1/tours',newtour);
// app.patch('/api/vi/tours/:id',updatetour);
// app.delete('/api/vi/tours/:id',deletetour);








app.use('/api/v1/tours',tourrouter);
app.use('/api/v1/users',userrouter);
app.all('*',(req,res,next)=>{
    next(new AppError(`can't find the ${req.originalUrl} route`,404));
    // const error = new Error(`can't find the ${req.originalUrl} route`);
    // error.status = "Fail";
    // error.statusCode = 404;
    // next(error);
    // // res.status(404).json({
    // //  status:"Fail",
    // //  message:`Invalid route ${req.originalUrl}`
    // // });
});
app.use(Error);

//server starting
module.exports = app;