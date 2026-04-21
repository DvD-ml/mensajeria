import { TipoCanal } from "@prisma/client";
import { channelRepository } from "../repositories/channelRepository";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const channelService = {
  async crearCanal(data: {
    empresaId: number;
    userId: number;
    nombre: string;
    descripcion?: string;
    tipoCanal?: "PUBLICO" | "PRIVADO";
  }) {
    if (!data.nombre?.trim()) {
      throw new Error("El nombre del canal es obligatorio");
    }

    return channelRepository.createWithOwner({
      empresaId: data.empresaId,
      creadoPorId: data.userId,
      nombre: data.nombre.trim(),
      slug: slugify(data.nombre),
      descripcion: data.descripcion?.trim(),
      tipoCanal: (data.tipoCanal ?? "PUBLICO") as TipoCanal,
    });
  },

  async listarMisCanales(userId: number, empresaId: number) {
    return channelRepository.listByUser(userId, empresaId);
  },
};