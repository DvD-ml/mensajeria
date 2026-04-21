import { prisma } from "../config/db";

type CreateMessageInput = {
  empresaId: number;
  remitenteId: number;
  canalId: number;
  contenido: string;
  mensajePadreId?: number;
};

export const messageRepository = {
  createChannelMessage(data: CreateMessageInput) {
    return prisma.mensaje.create({
      data: {
        empresaId: data.empresaId,
        remitenteId: data.remitenteId,
        canalId: data.canalId,
        contenido: data.contenido,
        mensajePadreId: data.mensajePadreId,
      },
      include: {
        remitente: {
          select: {
            id: true,
            nombreMostrar: true,
            email: true,
          },
        },
      },
    });
  },

  listByChannel(channelId: number) {
    return prisma.mensaje.findMany({
      where: {
        canalId: channelId,
        eliminado: false,
      },
      include: {
        remitente: {
          select: {
            id: true,
            nombreMostrar: true,
            email: true,
          },
        },
      },
      orderBy: {
        creadoEn: "asc",
      },
    });
  },
};