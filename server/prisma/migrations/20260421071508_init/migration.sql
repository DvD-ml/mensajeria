-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `es_sistema` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `empresas_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departamentos_empresa_id_nombre_key`(`empresa_id`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `departamento_id` INTEGER NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipos_empresa_id_nombre_key`(`empresa_id`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `rol_id` INTEGER NOT NULL,
    `departamento_id` INTEGER NULL,
    `equipo_principal_id` INTEGER NULL,
    `nombre` VARCHAR(80) NOT NULL,
    `apellidos` VARCHAR(120) NULL,
    `nombre_mostrar` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `contrasena_hash` VARCHAR(255) NOT NULL,
    `cargo` VARCHAR(120) NULL,
    `avatar_url` VARCHAR(255) NULL,
    `estado_presencia` ENUM('ONLINE', 'OFFLINE', 'OCUPADO', 'AUSENTE') NOT NULL DEFAULT 'OFFLINE',
    `estado_cuenta` ENUM('PENDIENTE', 'ACTIVA', 'SUSPENDIDA', 'ELIMINADA') NOT NULL DEFAULT 'ACTIVA',
    `ultimo_login` DATETIME(3) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `canales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `departamento_id` INTEGER NULL,
    `equipo_id` INTEGER NULL,
    `creado_por` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `tipo_canal` ENUM('PUBLICO', 'PRIVADO') NOT NULL DEFAULT 'PUBLICO',
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `archivado_en` DATETIME(3) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `canales_empresa_id_slug_key`(`empresa_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miembros_canal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canal_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `rol_miembro` ENUM('PROPIETARIO', 'MODERADOR', 'MIEMBRO') NOT NULL DEFAULT 'MIEMBRO',
    `unido_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miembros_canal_canal_id_usuario_id_key`(`canal_id`, `usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensajes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `remitente_id` INTEGER NOT NULL,
    `canal_id` INTEGER NOT NULL,
    `mensaje_padre_id` INTEGER NULL,
    `tipo_mensaje` ENUM('TEXTO', 'SISTEMA', 'ARCHIVO', 'IMAGEN') NOT NULL DEFAULT 'TEXTO',
    `contenido` TEXT NULL,
    `editado` BOOLEAN NOT NULL DEFAULT false,
    `editado_en` DATETIME(3) NULL,
    `eliminado` BOOLEAN NOT NULL DEFAULT false,
    `eliminado_en` DATETIME(3) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `departamentos` ADD CONSTRAINT `departamentos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipos` ADD CONSTRAINT `equipos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipos` ADD CONSTRAINT `equipos_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_equipo_principal_id_fkey` FOREIGN KEY (`equipo_principal_id`) REFERENCES `equipos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `canales` ADD CONSTRAINT `canales_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `canales` ADD CONSTRAINT `canales_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `canales` ADD CONSTRAINT `canales_equipo_id_fkey` FOREIGN KEY (`equipo_id`) REFERENCES `equipos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `canales` ADD CONSTRAINT `canales_creado_por_fkey` FOREIGN KEY (`creado_por`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miembros_canal` ADD CONSTRAINT `miembros_canal_canal_id_fkey` FOREIGN KEY (`canal_id`) REFERENCES `canales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miembros_canal` ADD CONSTRAINT `miembros_canal_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_remitente_id_fkey` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_canal_id_fkey` FOREIGN KEY (`canal_id`) REFERENCES `canales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_mensaje_padre_id_fkey` FOREIGN KEY (`mensaje_padre_id`) REFERENCES `mensajes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
