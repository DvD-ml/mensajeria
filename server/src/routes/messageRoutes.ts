import { Router } from "express";
import { messageController } from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/canal/:channelId", authMiddleware, messageController.listarCanal);
router.post("/canal/:channelId", authMiddleware, messageController.enviarCanal);

export default router;