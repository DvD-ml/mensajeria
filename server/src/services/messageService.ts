import { channelRepository } from "../repositories/channelRepository";
import { messageRepository } from "../repositories/messageRepository";

export const messageService = {
  async enviarMensajeCanal(data: {
    empresaId: number;
    userId: number;
    canalId: number;
    contenido: string;
    mensajePadreId?: number;
  }) {
    if (!data.contenido?.trim()) {
      throw new Error("El contenido del mensaje es obligatorio");
    }

    const membership = await channelRepository.isUserMember(
      data.canalId,
      data.userId
    );

    if (!membership) {
      throw new Error("No perteneces a este canal");
    }

    return messageRepository.createChannelMessage({
      empresaId: data.empresaId,
      remitenteId: data.userId,
      canalId: data.canalId,
      contenido: data.contenido.trim(),
      mensajePadreId: data.mensajePadreId,
    });
  },

  async listarMensajesCanal(canalId: number, userId: number) {
    const membership = await channelRepository.isUserMember(canalId, userId);

    if (!membership) {
      throw new Error("No perteneces a este canal");
    }

    return messageRepository.listByChannel(canalId);
  },
};