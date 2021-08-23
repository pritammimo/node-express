const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Global MiDDLEWARS
// set Security http headers
app.use(helmet());
if (process.env.NODE_ENV === 'develoment') {
  app.use(morgan('dev'));
}
//limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this ip,please try again after 1 hour',
});

app.use('/api', limiter);

app.use(morgan('dev'));
//Body-parser
app.use(
  express.json({
    limit: '10kb',
  })
);
//Data Sanitzation against Nosql query injection
app.use(mongoSanitize());
//Data sanitazation against xss
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
    ],
  })
);
//Serving static file
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//For error handling
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//Global Middleware for errorhandling
app.use(globalErrorHandler);
module.exports = app;
