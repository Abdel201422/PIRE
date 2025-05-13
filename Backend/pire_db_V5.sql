-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 12-05-2025 a las 20:19:40
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
(14, 'DIW', 5, 'Home', 'qweqeqeqeqeqeqew', 'uploads/5/Home.png', '2025-05-11 20:06:13', 0, 0, 1, 'image/png');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `documento`
--
ALTER TABLE `documento`
  ADD CONSTRAINT `FK_B6B12EC7895FDA48` FOREIGN KEY (`asignatura_codigo`) REFERENCES `asignatura` (`codigo`),
  ADD CONSTRAINT `FK_B6B12EC7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
