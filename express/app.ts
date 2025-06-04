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

import {indexRouter} from './routes/index';
import {apiV1Router} from "./routes/api.v1.routes";
import {CustomRequest} from "./schemas/DataObjects";
import {sessionMiddleware} from "./middleware/session";
import {errorHandler} from "./middleware/errorHandler";
import {allowedOrigins} from "./lib/Auth";

const app: Application = express();

console.log(`allowed origin: ${allowedOrigins}`);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // Allow cookies
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(sessionMiddleware);

// disable automatic browser request for this path
app.get('/favicon.ico', (req: Request, res: Response): void => { res.status(204).end(); });
app.use('/', indexRouter);

app.use('/api/v1', apiV1Router);

// catch api 404s
app.use('/api/v1/{*splat}', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'error',
    message: `The requested resource ${req.method} ${req.originalUrl} was not found.`,
  });
});

// catch general 404s
app.use('*splat', (req, res) => {
  res.status(404).send('Page not found');
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err.stack);
  const errorJson = {
    status: "error",
    error: {
      message: "Sorry, we were unable to process your request. Please try again later.",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
    },
  };
  res.status(err.status || 500).json(errorJson);
});

app.use(errorHandler);

export default app;
