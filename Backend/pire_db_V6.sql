-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 13-05-2025 a las 18:01:40
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pire_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `codigo` varchar(4) NOT NULL,
  `curso_cod_curso` varchar(4) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `asignatura`
--

INSERT INTO `asignatura` (`codigo`, `curso_cod_curso`, `nombre`) VALUES
('ANQ', 'L1', 'Análisis químicos'),
('APS', 'E1', 'Autonomía personal y salud infantil'),
('BD', 'D1', 'Bases de datos'),
('COF', 'A2', 'Contabilidad y fiscalidad'),
('COM', 'A1', 'Comunicación y atención al cliente'),
('CSM', 'M2', 'Configuración de sistemas mecatrónicos'),
('CYS', 'L2', 'Calidad y seguridad en el laboratorio'),
('DCM', 'E1', 'Desarrollo cognitivo y motor'),
('DID', 'E1', 'Didáctica de la educación infantil'),
('DIW', 'D2', 'Diseño de interfaces web'),
('DPL', 'D2', 'Despliegue de aplicaciones web'),
('DSO', 'E2', 'Desarrollo socioafectivo'),
('DWC', 'D2', 'Desarrollo web en entorno cliente'),
('DWS', 'D2', 'Desarrollo web en entorno servidor'),
('EFQ', 'L1', 'Ensayos fisicoquímicos'),
('EIE', 'D2', 'Empresa e iniciativa emprendedora'),
('EIE2', 'A2', 'Empresa e iniciativa emprendedora'),
('EIE3', 'E2', 'Empresa e iniciativa emprendedora'),
('EIE4', 'M1', 'Empresa e iniciativa emprendedora'),
('EIE5', 'L1', 'Empresa e iniciativa emprendedora'),
('ENB', 'L2', 'Ensayos biotecnológicos'),
('ENF', 'L1', 'Ensayos físicos'),
('ENM', 'L2', 'Ensayos microbiológicos'),
('ENT', 'D1', 'Entornos de desarrollo'),
('EXC', 'E1', 'Expresión y comunicación'),
('FOL', 'D1', 'Formación y orientación laboral'),
('FOL2', 'A1', 'Formación y orientación laboral'),
('FOL3', 'E1', 'Formación y orientación laboral'),
('FOL4', 'M1', 'Formación y orientación laboral'),
('FOL5', 'L1', 'Formación y orientación laboral'),
('GES', 'A1', 'Gestión de la documentación jurídica y empresarial'),
('GFI', 'A2', 'Gestión financiera'),
('GLC', 'A2', 'Gestión logística y comercial'),
('GRH', 'A2', 'Gestión de recursos humanos'),
('HAB', 'E2', 'Habilidades sociales'),
('ING', 'A1', 'Inglés'),
('INT', 'E2', 'Intervención con familias y atención a menores en riesgo social'),
('ISM', 'M2', 'Integración de sistemas'),
('JUE', 'E1', 'El juego infantil y su metodología'),
('LMSG', 'D1', 'Lenguajes de marcas y sistemas de gestión de información'),
('MPM', 'L1', 'Muestreo y preparación de la muestra'),
('OFI', 'A1', 'Ofimática y proceso de la información'),
('PAU', 'E2', 'Primeros auxilios'),
('PFA', 'M1', 'Procesos de fabricación'),
('PGM', 'M2', 'Procesos y gestión del mantenimiento'),
('PIA', 'A1', 'Proceso integral de la actividad comercial'),
('PROA', 'A2', 'Proyecto'),
('PROE', 'E2', 'Proyecto'),
('PROG', 'D1', 'Programación'),
('PROL', 'L2', 'Proyecto'),
('PROM', 'M2', 'Proyecto'),
('PROY', 'D2', 'Proyecto DAW'),
('RGS', 'M1', 'Representación gráfica de sistemas mecatrónicos'),
('RSC', 'A1', 'Recursos humanos y responsabilidad social corporativa'),
('SEE', 'M1', 'Sistemas eléctricos y electrónicos'),
('SIM', 'A2', 'Simulación empresarial'),
('SINF', 'D1', 'Sistemas informáticos'),
('SME', 'M1', 'Sistemas mecánicos'),
('SSM', 'M2', 'Simulación de sistemas mecatrónicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclo`
--

CREATE TABLE `ciclo` (
  `cod_ciclo` varchar(4) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciclo`
--

INSERT INTO `ciclo` (`cod_ciclo`, `nombre`, `descripcion`) VALUES
('ADF', 'Administración y Finanzas', 'Ciclo formativo de grado superior de Administración y Finanzas'),
('DAW', 'Desarrollo de Aplicaciones Web', 'Ciclo formativo de grado superior de Desarrollo de Aplicaciones Web'),
('EIN', 'Educación Infantil', 'Ciclo formativo de grado superior de Educación Infantil'),
('LAB', 'Laboratorio de Análisis y de Control de Calidad', 'Ciclo formativo de grado superior de Laboratorio de Análisis y de Control de Calidad'),
('MEC', 'Mecatrónica Industrial', 'Ciclo formativo de grado superior de Mecatrónica Industrial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `documento_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comentario` longtext NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `cod_curso` varchar(4) NOT NULL,
  `ciclo_cod_ciclo` varchar(4) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`cod_curso`, `ciclo_cod_ciclo`, `nombre`) VALUES
('A1', 'ADF', '1º Curso Administración y Finanzas'),
('A2', 'ADF', '2º Curso Administración y Finanzas'),
('D1', 'DAW', '1º Curso DAW'),
('D2', 'DAW', '2º Curso DAW'),
('E1', 'EIN', '1º Curso Educación Infantil'),
('E2', 'EIN', '2º Curso Educación Infantil'),
('L1', 'LAB', '1º Curso Laboratorio'),
('L2', 'LAB', '2º Curso Laboratorio'),
('M1', 'MEC', '1º Curso Mecatrónica'),
('M2', 'MEC', '2º Curso Mecatrónica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250502165504', '2025-05-05 17:03:49', 143);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento`
--

CREATE TABLE `documento` (
  `id` int(11) NOT NULL,
  `asignatura_codigo` varchar(4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(70) NOT NULL,
  `descripcion` longtext DEFAULT NULL,
  `ruta_archivo` varchar(150) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `aprobado` tinyint(1) NOT NULL,
  `numero_descargas` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `tipo_archivo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id`, `asignatura_codigo`, `user_id`, `titulo`, `descripcion`, `ruta_archivo`, `fecha_subida`, `aprobado`, `numero_descargas`, `activo`, `tipo_archivo`) VALUES
(13, 'BD', 5, 'Anexo I. Memoria final.v2', 'iiikkkk', 'uploads/5/Anexo I. Memoria final.v2.pdf', '2025-05-11 19:53:26', 0, 0, 1, 'application/pdf'),
(14, 'DIW', 5, 'Home', 'qweqeqeqeqeqeqew', 'uploads/5/Home.png', '2025-05-11 20:06:13', 0, 0, 1, 'image/png'),
(15, 'COM', 22, 'favicon', 'qwqwqwqwq', 'uploads/22/favicon.png', '2025-05-12 19:44:21', 0, 0, 1, 'image/png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `nombre`, `apellido`, `fecha_registro`, `activo`, `avatar`, `is_verified`) VALUES
(4, 'admin@pire.com', '[\"ROLE_ADMIN\"]', '$2y$13$4e3vzdznGaRvJ00SgG13De0piMkJ1OUw4epFeLjLMpgsESjprV2eK', 'Administrador', 'Sistema', '2025-05-09 10:48:53', 1, NULL, 1),
(5, 'alumno1@pire.com', '[\"ROLE_USER\"]', '$2y$13$vx4h6sd1HXsPhFQyH5kcoOb0I2AlB3M9LezX9cvXCqhno3QXaJxLG', 'Alumno', 'Uno', '2025-05-09 10:48:54', 1, NULL, 1),
(6, 'alumno2@pire.com', '[\"ROLE_USER\"]', '$2y$13$1F6jcu.ND7ry.2zWuFw//ODjxaAsBfaySCbREw1...VFi6KaVBpPG', 'Alumno', 'Dos', '2025-05-09 10:48:54', 1, NULL, 1),
(7, 'alumno3@pire.com', '[\"ROLE_USER\"]', '$2y$13$yXxmoQ8.V7SiOjVd6SbwRuEVdzRAXTx1jIDnjIQO/5u7TrNDUyqJm', 'Alumno', 'Tres', '2025-05-09 10:48:54', 1, NULL, 1),
(22, 'daniel@example.com', '[\"ROLE_USER\"]', '$2y$13$AseUeTltbIRG5dCCOEtUTeOFtpuwQHam8zLizNwR.ipeI81ZFoGm2', 'Daniel', 'Martínez Terol', '2025-05-12 19:21:52', 1, 'uploads/22/avatar/avatar.svg', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion`
--

CREATE TABLE `valoracion` (
  `id` int(11) NOT NULL,
  `documento_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `puntuacion` smallint(6) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `valoracion`
--

INSERT INTO `valoracion` (`id`, `documento_id`, `user_id`, `puntuacion`, `fecha`) VALUES
(3, 15, 7, 3, '2025-05-13 08:30:36');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `IDX_9243D6CEA0EBEF6` (`curso_cod_curso`),
  ADD KEY `idx_asignatura_nombre` (`nombre`);

--
-- Indices de la tabla `ciclo`
--
ALTER TABLE `ciclo`
  ADD PRIMARY KEY (`cod_ciclo`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4B91E70245C0CF75` (`documento_id`),
  ADD KEY `IDX_4B91E702A76ED395` (`user_id`),
  ADD KEY `idx_comentario_fecha` (`fecha`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`cod_curso`),
  ADD KEY `IDX_CA3B40EC9B25319B` (`ciclo_cod_ciclo`);

--
-- Indices de la tabla `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `documento`
--
ALTER TABLE `documento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B6B12EC7895FDA48` (`asignatura_codigo`),
  ADD KEY `IDX_B6B12EC7A76ED395` (`user_id`),
  ADD KEY `idx_documento_titulo` (`titulo`),
  ADD KEY `idx_documento_fecha_subida` (`fecha_subida`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`),
  ADD KEY `idx_user_nombre` (`nombre`),
  ADD KEY `idx_user_apellido` (`apellido`);

--
-- Indices de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6D3DE0F445C0CF75` (`documento_id`),
  ADD KEY `IDX_6D3DE0F4A76ED395` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD CONSTRAINT `FK_9243D6CEA0EBEF6` FOREIGN KEY (`curso_cod_curso`) REFERENCES `curso` (`cod_curso`);

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `FK_4B91E70245C0CF75` FOREIGN KEY (`documento_id`) REFERENCES `documento` (`id`),
  ADD CONSTRAINT `FK_4B91E702A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `FK_CA3B40EC9B25319B` FOREIGN KEY (`ciclo_cod_ciclo`) REFERENCES `ciclo` (`cod_ciclo`);

--
-- Filtros para la tabla `documento`
--
ALTER TABLE `documento`
  ADD CONSTRAINT `FK_B6B12EC7895FDA48` FOREIGN KEY (`asignatura_codigo`) REFERENCES `asignatura` (`codigo`),
  ADD CONSTRAINT `FK_B6B12EC7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD CONSTRAINT `FK_6D3DE0F445C0CF75` FOREIGN KEY (`documento_id`) REFERENCES `documento` (`id`),
  ADD CONSTRAINT `FK_6D3DE0F4A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
