import express from "express";
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const hello = "hello from routes/index.js";
  console.log(hello);
  res.render('index', { title: 'Express' });
});

module.exports = router;
