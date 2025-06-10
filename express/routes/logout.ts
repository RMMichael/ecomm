import {Router, NextFunction, Request, Response} from "express";
import { Auth } from "../lib/Auth";

const router = Router();
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  console.log("api hit /logout", req.session, req.user);

  if (!req.session) {
    console.log("logout requested, but the current session was not found");
    res.json({
      status: "success",
      message: "You are logged out.",
    });
    return;
  }

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

export { router as logoutRouter };
