const express = require('express'),
 path = require('path'),
 cookieParser = require('cookie-parser'),
 lessMiddleware = require('less-middleware'),
 logger = require('morgan'),
 fs = require('fs'),
 http = require('http'),
 https = require('https'),
 indexRouter = require('./routes/index'),
 usersRouter = require('./routes/users');
const PORT = 4000;
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('images', path.join(__dirname, 'images'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
module.exports = app;
