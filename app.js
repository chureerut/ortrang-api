const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

const app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//either set the strictQuery option to true globally to suppress the warning
mongoose.set('strictQuery',true);

mongoose.connect(
    "mongodb+srv://ortranglineoa:ortrang23*@ortrang.1up0uq7.mongodb.net/ortrang?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

// app.listen(PORT,()=>{
//   console.log('Server started on port 5000')
// })

module.exports = app;
