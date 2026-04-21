import { Request, Response } from "express";
import { RequestConAuth } from "../middleware/authMiddleware";
import { messageService } from "../services/messageService";

export const messageController = {
  async enviarCanal(req: Request, res: Response) {
    try {
      const auth = (req as RequestConAuth).auth;
      if (!auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const canalId = Number(req.params.channelId);

      const mensaje = await messageService.enviarMensajeCanal({
        empresaId: auth.empresaId,
        userId: auth.userId,
        canalId,
        contenido: req.body.contenido,
        mensajePadreId: req.body.mensajePadreId,
      });

      return res.status(201).json(mensaje);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al enviar mensaje",
      });
    }
  },

  async listarCanal(req: Request, res: Response) {
    try {
      const auth = (req as RequestConAuth).auth;
      if (!auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const canalId = Number(req.params.channelId);

      const mensajes = await messageService.listarMensajesCanal(
        canalId,
        auth.userId
      );

      return res.json(mensajes);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al listar mensajes",
      });
    }
  },
};