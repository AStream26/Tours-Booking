const express = require('express');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const Error = require('./controllers/Errorcontroler.js');
const AppError = require('./utils/Errorhandle.js');
const userrouter = require('./Routes/userRouter');
const tourrouter = require('./Routes/tourRoute');
const reviewrouter = require('./Routes/reviewRoute');
const app = express();


const limiters = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"To Many request !! "
});

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss attack
app.use(xss());



//1) setting security http header
app.use(helmet());
//2) serving static files
app.use(express.static(`${__dirname}/public`));

//3) logging the request
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
//4) limiting the request
app.use('/api',limiters);

//3)bodyparser- Reading data from body into req.body
app.use(express.json({limit:'10kb'}));//for post request to get data
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
app.use('/api/v1/review',reviewrouter);
app.all('*',(req,res,next)=>{
    next(new AppError(`can't find the ${req.originalUrl} route`,404));
});

app.use(Error);

//server starting
module.exports = app;