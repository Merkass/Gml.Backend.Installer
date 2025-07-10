#!/bin/bash

echo "[GML-Render] Запуск GML Launcher на Render..."

# Проверка переменных окружения
if [ -z "$PORT" ]; then
    export PORT=5000
fi

if [ -z "$GML_PROJECT_NAME" ]; then
    export GML_PROJECT_NAME="GML-Render"
fi

echo "[GML-Render] Переменные окружения:"
echo "PORT: $PORT"
echo "GML_PROJECT_NAME: $GML_PROJECT_NAME"

# Создание конфигурационных файлов
echo "[GML-Render] Создание конфигурации..."

# Создаем базовый .env файл
cat > /app/.env << EOL
GML_PROJECT_NAME=$GML_PROJECT_NAME
GML_PANEL_URL=http://0.0.0.0:$PORT
GML_DATA_PATH=/app/data
GML_CONFIG_PATH=/app/config
GML_LOGS_PATH=/app/logs
DATABASE_URL=$DATABASE_URL
REDIS_URL=$REDIS_URL
NODE_ENV=production
PORT=$PORT
EOL

echo "[GML-Render] Конфигурация создана."

# Проверка файлов
echo "[GML-Render] Проверка файлов:"
ls -la /app/

# Запуск Node.js сервера
echo "[GML-Render] Запуск Node.js сервера..."
exec node server.js
