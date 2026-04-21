import { Router } from "express";
import { channelController } from "../controllers/channelController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/mis-canales", authMiddleware, channelController.misCanales);
router.post("/", authMiddleware, channelController.crear);

export default router;