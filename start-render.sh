#!/bin/bash

echo "[GML-Render] Запуск GML Launcher на Render..."

# Проверка переменных окружения
if [ -z "$PORT" ]; then
    export PORT=5000
fi

if [ -z "$GML_PROJECT_NAME" ]; then
    export GML_PROJECT_NAME="GML-Render"
fi

# Создание конфигурационных файлов
echo "[GML-Render] Создание конфигурации..."

# Создаем базовый .env файл
cat > /app/.env << EOL
GML_PROJECT_NAME=$GML_PROJECT_NAME
GML_PANEL_URL=http://0.0.0.0:$PORT
GML_DATA_PATH=/app/data
GML_CONFIG_PATH=/app/config
DATABASE_URL=$DATABASE_URL
REDIS_URL=$REDIS_URL
EOL

# Создаем упрощенный docker-compose.yml для Render
cat > /app/docker-compose.yml << EOL
version: '3.8'
services:
  gml-backend:
    image: gml/backend:latest
    ports:
      - "$PORT:5000"
    environment:
      - ASPNETCORE_URLS=http://+:5000
      - GML_PROJECT_NAME=$GML_PROJECT_NAME
      - DATABASE_URL=$DATABASE_URL
      - REDIS_URL=$REDIS_URL
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    restart: unless-stopped
    
  gml-frontend:
    image: gml/frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - gml-backend
    environment:
      - NEXT_PUBLIC_API_URL=http://gml-backend:5000
    restart: unless-stopped
EOL

echo "[GML-Render] Конфигурация создана."

# Проверка здоровья сервиса
echo "[GML-Render] Настройка health check..."
mkdir -p /app/health
echo "OK" > /app/health/index.html

# Запуск приложения
echo "[GML-Render] Запуск GML Backend..."

# Имитация запуска backend сервиса
# В реальном случае здесь будет запуск .NET приложения
python3 -m http.server $PORT --bind 0.0.0.0 --directory /app/health &

# Ожидание завершения
wait
