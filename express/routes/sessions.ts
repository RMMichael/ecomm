import { Router } from "express";
import { SessionsController } from "../pg/sessions";

const router = Router();
// TODO: admin auth
router.get('/', async (req, res) => {
  const data = await SessionsController.getAll();

  res.json({
    status: "success",
    data
  })
});
router.delete('/:id', async (req, res) => {
  // delete session id
  const {success, error} = await SessionsController.deleteId(req.params.id);
  if (error) {
    res.json({
      status: "error",
      message: `Could not delete ${req.params.id}`
    });
    return;
  }

  res.json({
    status: "success",
    message: `Deleted ${req.params.id}`,
    data: {

    }
  })
});

export { router as sessionsRouter }
