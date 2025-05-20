# 1. Imagen base PHP-FPM Alpine
FROM php:8.2-fpm-alpine

# 2. Instalar extensiones para Symfony y MySQL
RUN apk add --no-cache icu-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install intl pdo pdo_mysql xml opcache

# 3. Copiar Composer (imagen oficial)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Instalar Symfony CLI (ÚLTIMA VERSIÓN VÁLIDA - 5.5.1 al 02/05/2025)
RUN apk add --no-cache wget curl bash git \
    && curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# 5. Directorio de trabajo
WORKDIR /var/www/html

# 6. Copiar TODO el código de la aplicación
COPY . .

# 7. Configurar entorno de producción
ENV APP_ENV=prod \
    APP_DEBUG=0 \
    DATABASE_URL="sqlite:///:memory:"

# 8. Instalar dependencias
RUN rm -rf vendor/ \
  && composer install \
      --no-interaction \
      --optimize-autoloader \
      --no-dev \
      --no-scripts \
      --ignore-platform-reqs \
  && composer dump-autoload --optimize

# 9. Limpiar caché
RUN php bin/console cache:clear --no-warmup --env=prod \
  && php bin/console cache:warmup --env=prod

# 10. Ajustar permisos
RUN chown -R www-data:www-data var/ vendor/

# 11. Exponer puerto
EXPOSE 9000

# 12. Comando final
CMD ["php-fpm"]