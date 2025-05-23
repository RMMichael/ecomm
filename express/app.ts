import {Auth} from "./middleware/Auth";

var createError = require('http-errors');
import express, { Application, Request, Response } from "express";
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// https://www.npmjs.com/package/ts-node#missing-types
// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      data?: Record<string, any>; // "data" property with a general object type
    }
  }
}

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import loginRouter from './routes/login';
import {CustomRequest} from "./schemas/DataObjects";

const app: Application = express();

console.log(`frontend origin: ${process.env.FRONTEND_ORIGIN}`);
app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN],
  credentials: true,  // Allow cookies
}));

app.get('/routes/users', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for users!'})
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  if (req.method !== "GET") {
    const origin: any = req.headers["Origin"];
    // You can also compare it against the Host or X-Forwarded-Host header.
    if (origin === null || !/.*['localhost']*.com/.test(origin)) {
      res.status(403);
      return;
    }

    if (!/.*['localhost/login']*.com/.test(origin)) {
      // create session on successful login
      // get cookies from request
      const token = req.cookies["session"] ?? null;
      if (token !== null) {
        const {session, user} = await Auth.validateSessionToken(token);
        console.log(`current user: ${JSON.stringify(user)}`);
        req.data = {
          session,
          user,
        };
      }
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

app.use((req, res, next) => {
  console.log(`after routes`);
  // next();
});

// disable automatic browser request for this path
app.get('/favicon.ico', (req: Request, res: Response): void => { res.status(204).end(); });

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err.stack);
  const errorJson = {
    error: {
      message: err.message, // Provide the error message
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
    },
  };
  res.status(err.status || 500).json(errorJson);
});

module.exports = app;
