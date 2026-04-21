import { Request, Response } from "express";
import { authService } from "../services/authService";
import { RequestConAuth } from "../middleware/authMiddleware";

export const authController = {
  async registroInicial(req: Request, res: Response) {
    try {
      const result = await authService.registroInicial(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al registrar",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({
        message: error instanceof Error ? error.message : "Error al iniciar sesión",
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const auth = (req as RequestConAuth).auth;
      if (!auth) {
        return res.status(401).json({ message: "No autorizado" });
      }

      const result = await authService.me(auth.userId);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error al obtener el usuario",
      });
    }
  },
};