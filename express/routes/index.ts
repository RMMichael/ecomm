import express from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const hello = "hello from routes/index.js";
  console.log(hello);
  res.send('index');
});

export default router;
