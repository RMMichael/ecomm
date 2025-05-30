import { Request, Response, NextFunction, Router} from "express";

const router = Router();
import { query } from "../pg/queries";
import { Auth } from "../lib/Auth";

/* old stuff
if (token !== null) {
        const {session, user} = await Auth.validateSessionToken(token);
        console.log(`current user: ${JSON.stringify(user)}`);
        req.data = {
          session,
          user,
        };
      }
 */

/* GET users listing. */
router.get('/me', async function(req: Request, res: Response, next: NextFunction) {
  // user is already attached to request by the session middleware
  console.log("api hit /me", req.session, req.user);
  res.json({
    status: "success",
    data: {
      user: req.user,
    }
  });
});

export default router;
