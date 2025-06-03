import { Router } from "express";
const indexRouter = Router();

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  const hello = "hello from routes/index.js";
  console.log(hello);
  res.send('index');
});

export { indexRouter };
