import { Request, Response } from "express";
import { RequestConAuth } from "../middleware/authMiddleware";
import { channelService } from "../services/channelService";

export const channelController = {
  async crear(req: Request, res: Response) {
    try {
      const auth = (req as RequestConAuth).auth;
      if (!auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const canal = await channelService.crearCanal({
        empresaId: auth.empresaId,
        userId: auth.userId,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tipoCanal: req.body.tipoCanal,
      });

      return res.status(201).json(canal);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al crear canal",
      });
    }
  },

  async misCanales(req: Request, res: Response) {
    try {
      const auth = (req as RequestConAuth).auth;
      if (!auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const canales = await channelService.listarMisCanales(
        auth.userId,
        auth.empresaId
      );

      return res.json(canales);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al listar canales",
      });
    }
  },
};