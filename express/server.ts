#!/usr/bin/env node

import * as fs from "node:fs";
import * as https from "node:https";

var app = require('./app');
var debug = require('debug')('express:server');
var http = require('http');

const options = {};

console.log(`https: ${process.env.HTTPSDEV}`);
const port = normalizePort(process.env.HTTPSDEV === 'true' ? 443 : 80);
console.log(`port: ${port}`)

app.set('port', port);
const server =  (process.env.HTTPSDEV === 'true') ? https.createServer(options, app) : http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// import { getUsers } from "./pg/queries";
