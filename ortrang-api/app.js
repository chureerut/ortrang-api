
const createError = require('http-errors');
const express = require('express');
const axios = require('axios').default
const dotenv = require('dotenv')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const indexRouter = require('./routes/api/index');
const orRouter = require('./routes/line/index');

const env = dotenv.config().parsed
const app = express();

let PORT = process.env.PORT || 5000


const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', indexRouter);
app.use('/hooks/ortrang', orRouter);

mongoose.connect(
  "mongodb+srv://ortranglineoa:ortrang23*@ortrang.1up0uq7.mongodb.net/ortrang?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT,()=>{
  console.log('Server Started on port 5000');
})

module.exports = app;
