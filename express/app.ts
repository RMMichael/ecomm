import {Auth} from "./lib/Auth";

var createError = require('http-errors');
import express, {Application, NextFunction, Request, Response} from "express";
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
import { Session, User } from './schemas/DataObjects';

// https://www.npmjs.com/package/ts-node#missing-types
// Extend the Express Request type
declare module 'express-serve-static-core' {
  interface Request {
    session?: Session;
    user?: User;
  }
}

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import {CustomRequest} from "./schemas/DataObjects";
import {sessionMiddleware} from "./middleware/session";
import {allowedOrigins} from "./lib/Auth";

const app: Application = express();

console.log(`allowed origin: ${allowedOrigins}`);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // Allow cookies
}));

app.get('/routes/users', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for users!'});
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sessionMiddleware);

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/logout', logoutRouter);

// disable automatic browser request for this path
app.get('/favicon.ico', (req: Request, res: Response): void => { res.status(204).end(); });

// catch 404 and forward to error handler
app.use('/api/v1/{*splat}', async (req: Request, res: Response, next: NextFunction) => {
  const path = (req.params.splat as unknown as String[]).join('/');
  res.status(200).json({
    status: 'error',
    message: `The requested resource ${req.method} /${path} was not found.`,
  });
});

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
