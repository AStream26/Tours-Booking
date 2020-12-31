const express = require('express');
const morgan  = require('morgan');
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
})







// app.get('/api/v1/tours',getAlltour);
// app.get('/api/v1/tours/:id',gettour);
// app.post('/api/v1/tours',newtour);
// app.patch('/api/vi/tours/:id',updatetour);
// app.delete('/api/vi/tours/:id',deletetour);








app.use('/api/v1/tours',tourrouter);
app.use('/api/v1/users',userrouter);

//server starting
module.exports = app;