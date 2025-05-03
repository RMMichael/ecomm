var express = require('express');
var router = express.Router();
import { query } from "../pg/queries";

/* GET users listing. */
router.get('/', async function(req: any, res: any, next: any) {
  const result = await query("SELECT * FROM t", [])
  res.send(result.rows);
});

module.exports = router;
