const express = require('express');
const path = require('path');
const passport = require('passport')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const helmet = require("helmet");
const ratelemit = require('express-rate-limit')
const dotenv = require('dotenv')
dotenv.config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');



const app = express();
app.use(cors())
app.set('trust proxy', 1)
const limiter = ratelemit({
    windowMs: 10 * 1000,
    max: 5
})
app.use(limiter)
app.use(passport.initialize())
app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api', blogRouter);

app.use(errorHandler)

module.exports = app;
