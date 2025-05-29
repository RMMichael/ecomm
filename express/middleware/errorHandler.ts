import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

const errorHandler = (err :ErrorRequestHandler, req :Request, res :Response, next :NextFunction) => {
}

module.exports = errorHandler;
