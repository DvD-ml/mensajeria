import { NextFunction, Request, Response } from "express";
import { TokenPayload, verifyToken } from "../utils/jwt";

export type RequestConAuth = Request & {
  auth?: TokenPayload;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    (req as RequestConAuth).auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}