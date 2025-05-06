const express = require('express');
const router = express.Router();
import { query } from "../pg/queries";
import { Auth } from "../middleware/Auth";


/* GET users listing. */
router.get('/', async function(req: any, res: any, next: any) {
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
