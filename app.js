const path = require('path');
const express = require('express');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const compress = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const Error = require('./controllers/Errorcontroler.js');
const AppError = require('./utils/Errorhandle.js');
const userrouter = require('./Routes/userRouter');
const tourrouter = require('./Routes/tourRoute');
const reviewrouter = require('./Routes/reviewRoute');
const viewRouter = require('./Routes/viewRoutes');
const BookRoute = require('./Routes/bookingRoute');
const cookieParser = require('cookie-parser');
const csp = require('express-csp');


const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

const limiters = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"To Many request !! "
});

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss attack
app.use(xss());
//app.use(compress);


//1) setting security http header
//app.use(helmet());
//app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet());
csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://js.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:8828',
        'ws://localhost:56558/',
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
    },
  },
});

//2) serving static files
app.use(express.static(`${__dirname}/public`));

//3) logging the request
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
//4) limiting the request
app.use('/api',limiters);

//3)bodyparser- Reading data from body into req.body
app.use(express.json({limit:'10kb'}));//for post request to get data parses the data from body
app.use(express.urlencoded({extended:true,limit:'10kb'}));
app.use(cookieParser());//parses the data from cookie


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
  //  console.log(req.cookies);
    next();
});







// app.get('/api/v1/tours',getAlltour);
// app.get('/api/v1/tours/:id',gettour);
// app.post('/api/v1/tours',newtour);
// app.patch('/api/vi/tours/:id',updatetour);
// app.delete('/api/vi/tours/:id',deletetour);






app.use('/',viewRouter);
app.use('/api/v1/tours',tourrouter);
app.use('/api/v1/users',userrouter);
app.use('/api/v1/review',reviewrouter);
app.use('/api/v1/bookings',BookRoute);
app.all('*',(req,res,next)=>{
    return next(new AppError(`can't find the ${req.originalUrl} route`,404));
});

app.use(Error);

//server starting
module.exports = app;