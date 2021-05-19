var createError = require('http-errors');
var express = require('express');
//sass
var sass = require('node-sass-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//express session
const session=require('express-session')

//flash
const flash = require('connect-flash');


//methode-override
const methodOverride=require("method-override")

//mongoose
const mongoose=require('mongoose');
const DB=`mongodb://arigo22:arigo221@skripsi-shard-00-00.bwxog.mongodb.net:27017,skripsi-shard-00-01.bwxog.mongodb.net:27017,skripsi-shard-00-02.bwxog.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-xynmrb-shard-0&authSource=admin&retryWrites=true&w=majority`
try{
  mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}catch(e){
  console.log(e)
}

// view engine setup
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//sass
app.use(
  sass({
      src: __dirname + '/sass', 
      dest: __dirname + '/public',
      debug: true,       
  })
);   
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {  maxAge: 60000 }
}))
//flash
app.use(flash())

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride("_method"))

//coreUI
app.use("/coreui",express.static(path.join(__dirname, 'node_modules/@coreui/coreui')));
app.use("/coreuiicon",express.static(path.join(__dirname, 'node_modules/@coreui')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
