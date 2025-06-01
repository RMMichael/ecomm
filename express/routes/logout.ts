import {NextFunction, Request, Response} from "express";

const express = require('express');
const router = express.Router();
import { query, pool } from "../pg/queries";
import { Auth } from "../lib/Auth";
import { User } from "../schemas/DataObjects";

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    res.json({
      status: "error",
      code: 404,
      message: `Current user not found`,
    });
    return;
  }

  console.log("api hit /logout", req.session, req.user);

  const success = await Auth.invalidateSession(req.session.id);
  if (!success) {
    console.error(`Could not delete session ${req.session.id} from database`);
    res.status(500);
    return;
  }

  res.cookie('session', '', {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 0,
    path: '/',
    secure: true,
  });

  // 205 - don't cache result ?
  res.json({
    status: "success",
  });
});

export default router;
