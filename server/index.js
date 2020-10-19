const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();

// require the DB connection to happen from the connection.js
require('./config/connection');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../react-ui/build')));

//Put all API endpoints under '/api'
Json = require('./models/dataset.js');

/* GET MongoDB Atlas data */
app.get('/api/maplayers', function (req, res) {
  Json.getData(function (err, data) {
    if(err){
      res.send(err);
      console.log(`Connection not working yet`)
    }
    res.json(data);
    console.log(`Connection works, outputting JSON from MongoDB!`)
  });
});

//Logger from Morgan for development
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'../react-ui/build/index.html'));
});

const port = process.env.PORT || 5000
app.listen(port);
console.log(`Listening on port ${port}`)
