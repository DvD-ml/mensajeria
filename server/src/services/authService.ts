import { prisma } from "../config/db";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { signToken } from "../utils/jwt";
import { userRepository } from "../repositories/userRepository";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedRoles() {
  const total = await prisma.rol.count();

  if (total > 0) return;

  await prisma.rol.createMany({
    data: [
      { nombre: "admin", descripcion: "Administrador de la empresa" },
      { nombre: "manager", descripcion: "Responsable de equipo" },
      { nombre: "empleado", descripcion: "Empleado estándar" },
    ],
  });
}

export const authService = {
  async registroInicial(data: {
    empresaNombre: string;
    nombre: string;
    apellidos?: string;
    email: string;
    password: string;
  }) {
    await seedRoles();

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese email");
    }

    const slugBase = slugify(data.empresaNombre);
    const slug = `${slugBase}-${Date.now()}`;

    const rolAdmin = await prisma.rol.findUnique({
      where: { nombre: "admin" },
    });

    if (!rolAdmin) {
      throw new Error("No se encontró el rol admin");
    }

    const passwordHash = await hashPassword(data.password);

    const result = await prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.create({
        data: {
          nombre: data.empresaNombre,
          slug,
          descripcion: `Workspace de ${data.empresaNombre}`,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          empresaId: empresa.id,
          rolId: rolAdmin.id,
          nombre: data.nombre,
          apellidos: data.apellidos,
          nombreMostrar: `${data.nombre} ${data.apellidos ?? ""}`.trim(),
          email: data.email,
          contrasenaHash: passwordHash,
          cargo: "Administrador",
        },
        include: {
          rol: true,
          empresa: true,
        },
      });

      return { empresa, usuario };
    });

    const token = signToken({
      userId: result.usuario.id,
      empresaId: result.empresa.id,
      rol: result.usuario.rol.nombre,
    });

    return {
      token,
      usuario: {
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        apellidos: result.usuario.apellidos,
        nombreMostrar: result.usuario.nombreMostrar,
        email: result.usuario.email,
        rol: result.usuario.rol.nombre,
        empresa: result.usuario.empresa.nombre,
      },
    };
  },

  async login(email: string, password: string) {
    const usuario = await userRepository.findByEmail(email);

    if (!usuario) {
      throw new Error("Credenciales incorrectas");
    }

    const passwordOk = await comparePassword(password, usuario.contrasenaHash);

    if (!passwordOk) {
      throw new Error("Credenciales incorrectas");
    }

    if (usuario.estadoCuenta !== "ACTIVA") {
      throw new Error("La cuenta no está activa");
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() },
    });

    const token = signToken({
      userId: usuario.id,
      empresaId: usuario.empresaId,
      rol: usuario.rol.nombre,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombreMostrar: usuario.nombreMostrar,
        email: usuario.email,
        rol: usuario.rol.nombre,
        empresa: usuario.empresa.nombre,
      },
    };
  },

  async me(userId: number) {
    const usuario = await userRepository.findById(userId);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      nombreMostrar: usuario.nombreMostrar,
      email: usuario.email,
      cargo: usuario.cargo,
      rol: usuario.rol.nombre,
      empresa: usuario.empresa.nombre,
      departamento: usuario.departamento?.nombre ?? null,
    };
  },
};