import { prisma } from "../config/db";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: true,
        empresa: true,
      },
    });
  },

  findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
        empresa: true,
        departamento: true,
        equipoPrincipal: true,
      },
    });
  },

  listByEmpresa(empresaId: number) {
    return prisma.usuario.findMany({
      where: { empresaId },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        nombreMostrar: true,
        email: true,
        cargo: true,
        estadoPresencia: true,
        departamento: {
          select: {
            id: true,
            nombre: true,
          },
        },
        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        nombreMostrar: "asc",
      },
    });
  },
};