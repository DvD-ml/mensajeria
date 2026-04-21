import { TipoCanal } from "@prisma/client";
import { prisma } from "../config/db";

type CreateChannelInput = {
  empresaId: number;
  creadoPorId: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  tipoCanal: TipoCanal;
};

export const channelRepository = {
  createWithOwner(data: CreateChannelInput) {
    return prisma.$transaction(async (tx) => {
      const canal = await tx.canal.create({
        data: {
          empresaId: data.empresaId,
          creadoPorId: data.creadoPorId,
          nombre: data.nombre,
          slug: data.slug,
          descripcion: data.descripcion,
          tipoCanal: data.tipoCanal,
        },
      });

      await tx.miembroCanal.create({
        data: {
          canalId: canal.id,
          usuarioId: data.creadoPorId,
          rolMiembro: "PROPIETARIO",
        },
      });

      return canal;
    });
  },

  listByUser(userId: number, empresaId: number) {
    return prisma.canal.findMany({
      where: {
        empresaId,
        miembros: {
          some: {
            usuarioId: userId,
            activo: true,
          },
        },
      },
      include: {
        miembros: {
          select: {
            usuarioId: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });
  },

  findById(id: number) {
    return prisma.canal.findUnique({
      where: { id },
    });
  },

  isUserMember(channelId: number, userId: number) {
    return prisma.miembroCanal.findFirst({
      where: {
        canalId: channelId,
        usuarioId: userId,
        activo: true,
      },
    });
  },
};