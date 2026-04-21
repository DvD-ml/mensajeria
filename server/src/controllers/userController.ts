import { Response } from "express";
import { RequestConAuth } from "../middleware/authMiddleware";
import { userService } from "../services/userService";

export const userController = {
  async listar(req: RequestConAuth, res: Response) {
    try {
      if (!req.auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const usuarios = await userService.listarUsuariosEmpresa(req.auth.empresaId);
      return res.json(usuarios);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al listar usuarios",
      });
    }
  },
};