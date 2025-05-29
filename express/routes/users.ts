import express from "express";

const router = express.Router();
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
router.get('/me', async function(req: any, res: any, next: any) {
  let result;
  try {
    result = await query("SELECT * FROM users", []);
    // console.log(result);
  } catch (e) {
    console.error(e);
  }

  console.log(`result rows: `, result?.rows);
  res.send(result?.rows ?? []);
});

export default router;
