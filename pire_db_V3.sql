-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2025 a las 12:42:02
-- Versión del servidor: 10.4.32-MariaDB-log
-- Versión de PHP: 8.2.12

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
  `asignatura_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` longtext DEFAULT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `fecha_subida` datetime NOT NULL,
  `aprobado` tinyint(1) NOT NULL,
  `archivo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id`, `asignatura_id`, `user_id`, `titulo`, `descripcion`, `ruta_archivo`, `fecha_subida`, `aprobado`, `archivo`) VALUES
(1, 4, 2, 'Apuntes 704', 'Descripción para documento 910', '/uploads/doc_440.pdf', '2024-11-21 23:34:08', 1, ''),
(2, 6, 2, 'Apuntes 80', 'Descripción para documento 382', '/uploads/doc_671.pdf', '2025-01-02 23:34:08', 1, ''),
(3, 3, 2, 'Apuntes 630', 'Descripción para documento 41', '/uploads/doc_317.pdf', '2025-01-15 23:34:08', 0, ''),
(4, 1, 2, 'Apuntes 699', 'Descripción para documento 381', '/uploads/doc_807.pdf', '2025-01-01 23:34:08', 1, ''),
(5, 2, 2, 'Apuntes 960', 'Descripción para documento 142', '/uploads/doc_832.pdf', '2024-11-29 23:34:08', 1, ''),
(6, 5, 1, 'Apuntes 838', 'Descripción para documento 339', '/uploads/doc_181.pdf', '2024-11-07 23:34:08', 1, ''),
(7, 1, 1, 'Ejemplo', 'Ejemplo', 'Quitar?', '2025-04-08 12:27:00', 1, 'archivos/solucion-actividad-2-67f4fa5365409.pdf');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `documento`
--
ALTER TABLE `documento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B6B12EC7C5C70C5B` (`asignatura_id`),
  ADD KEY `IDX_B6B12EC7A76ED395` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `documento`
--
ALTER TABLE `documento`
  ADD CONSTRAINT `FK_B6B12EC7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_B6B12EC7C5C70C5B` FOREIGN KEY (`asignatura_id`) REFERENCES `asignatura` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
