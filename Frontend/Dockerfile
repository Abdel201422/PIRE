# 1. Imagen base Node
FROM node:18-alpine

WORKDIR /app

# 2. Instala globalmente `serve`
RUN npm install -g serve

# 3. Si necesitas compilar Tailwind, descomenta estas líneas:
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# Y ajusta el CMD a ["serve", "-l", "3000", "dist"]

# 4. Copia todo (o ajusta si usas build)
COPY . .

# 5. Expone el puerto
EXPOSE 3000

# 6. Arranca el servidor estático
CMD ["serve", "-l", "3000", "."]
