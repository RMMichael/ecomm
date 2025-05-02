var express = require('express');
var router = express.Router();
import { getUsers } from "../pg/queries";

/* GET users listing. */
router.get('/', function(req: any, res: any, next: any) {
  res.send(getUsers(req, res));
});

module.exports = router;
