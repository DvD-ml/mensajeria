import { userRepository } from "../repositories/userRepository";

export const userService = {
  async listarUsuariosEmpresa(empresaId: number) {
    return userRepository.listByEmpresa(empresaId);
  },
};